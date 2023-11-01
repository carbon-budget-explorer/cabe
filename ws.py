"""

Install with

    pip install flask gunicorn

Run with

    gunicorn -w 4 'ws:app'

"""

import xarray as xr
import numpy as np

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# TODO improve endpoint names
# TODO use class-based views for a reusable nc-file viewer?
# TODO write tests with dummy data
# TODO validate inputs? Must if ws is public, and now it is due to src/routes/api/\[...path\]/+server.ts

# Global data (xr_dataread.nc)
dsGlobal = xr.open_dataset("data/xr_dataread.nc")


@app.get("/pathwayCarbon")
def pathwayCarbon():
    """Get global carbon pathway for a given selection.

    To test:
    production server:
    http://127.0.0.1:8000/pathwayCarbon?exceedanceRisk=0.5&negativeEmissions=0.5

    dev server:
    http://127.0.0.1:5000/pathwayCarbon?exceedanceRisk=0.5&negativeEmissions=0.5
    """
    df = (
        (
            dsGlobal.GHG_globe.sel(
                # TODO remove defaults
                # TODO use request.data instead of request.args?
                # args uses GET, data uses POST, GET is idempotent which is easier to cache so keep using args
                **pathwaySelection(),
                Time=slice(2021, 2100),
            )
            / 1000  # global GHG in Gt CO2e
        )
        .rename({"Time": "time"})
        .to_pandas()
    )
    return (
        df.agg(func=["min", "mean", "max"])
        .transpose()
        .reset_index()
        .to_dict(orient="records")
    )


@app.get("/pathwayChoices")
def pathwayChoices():
    return {
        "temperature": dsGlobal.Temperature.values.tolist(),
        "exceedanceRisk": dsGlobal.Risk.values.tolist(),
        "negativeEmissions": dsGlobal.NegEmis.values.tolist(),
    }


def pathwaySelection():
    choices = pathwayChoices()
    defaults = {k: v[len(v) // 2] for k, v in choices.items()}
    return dict(
        Temperature=request.args.get("temperature", defaults["temperature"]),
        Risk=request.args.get("exceedanceRisk", defaults["exceedanceRisk"]),
        NegEmis=request.args.get("negativeEmissions", defaults["negativeEmissions"]),
    )


@app.get("/regions")
def regions():
    return dsGlobal.Region.values.tolist()


@app.get("/pathwayStats")
def pathwayStats():
    used = dsGlobal.GHG_hist.sel(Region="EARTH").sum().values.tolist()
    remaining = (
        dsGlobal.GHG_globe.sel(
            TrajUnc="Medium",
            **pathwaySelection(),
        )
        .sum()
        .values.tolist()
    )
    total = used + remaining
    # TODO fix this hardcoded 37, should be global emissions in 2021
    relative = remaining / 37

    # Calculate gaps
    # TODO gaps is not needed on non-global pages, so dont compute if there
    gap_index = 2030
    pathway = (
        dsGlobal.GHG_globe.sel(Time=gap_index, TrajUnc="Medium", **pathwaySelection())
        .mean()
        .values
        + 0
    )
    curPol = ds_policyscen.CurPol.sel(Region="EARTH", Time=gap_index).mean().values + 0
    ndc = ds_policyscen.NDC.sel(Region="EARTH", Time=gap_index).mean().values + 0

    gaps = {
        "index": gap_index,
        "budget": pathway / 1000,
        "curPol": curPol / 1000,
        "ndc": ndc / 1000,
        "emission": (curPol - pathway) / 1000,
        "ambition": (ndc - pathway) / 1000,
    }
    return {
        "total": total,
        "used": used,
        "remaining": remaining,
        "relative": relative,
        "gaps": gaps,
    }


@app.get("/historicalCarbon/<region>")
def historicalCarbon(region="EARTH"):
    start = request.args.get("start")
    end = request.args.get("end")
    df = dsGlobal.GHG_hist.sel(Region=region, Time=slice(start, end)).to_pandas()

    if region == "EARTH":
        df /= 1000  # global GHG in Gt CO2e

    df.index.rename("time", True)
    df = df.reset_index()
    df["value"] = df.pop(0)
    return df.to_dict(orient="records")


@app.get("/populationOverTime/<region>")
def populationOverTime(region):
    start = request.args.get("start")
    end = request.args.get("end")
    scenario = "SSP2"
    df = dsGlobal.Population.sel(
        Scenario=scenario, Region=region, Time=slice(start, end)
    ).to_pandas()
    df.index.rename("time", True)
    df = df.dropna().reset_index()  # Note the missing data!
    df["value"] = df.pop(0)
    return df.to_dict(orient="records")


@app.get("/gdpOverTime/<region>")
def gdpOverTime(region):
    start = request.args.get("start")
    end = request.args.get("end")
    scenario = "SSP2"
    df = dsGlobal.Population.sel(
        Scenario=scenario, Region=region, Time=slice(start, end)
    ).to_pandas()
    df.index.rename("time", True)
    df = df.dropna().reset_index()  # Note the missing data!
    df["value"] = df.pop(0)
    return df.to_dict(orient="records")


# Map data (xr_alloc_2030.nc etc)
ds_alloc_2030 = xr.open_dataset("data/xr_alloc_2030.nc")
ds_alloc_2040 = xr.open_dataset("data/xr_alloc_2040.nc")
ds_alloc_2050 = xr.open_dataset("data/xr_alloc_2050.nc")
ds_alloc_FC = xr.open_dataset("data/xr_alloc_FC.nc")


def population_map(year, scenario="SSP2"):
    """Return population map as xarray data-array"""
    return dsGlobal.Population.sel(Time=year, Scenario=scenario)


@app.get("/map/<year>/GHG")
def fullCenturyBudgetSpatial(year):
    """Get map of GHG by year"""
    effortSharing = request.args.get("effortSharing", "PCC")
    selection = dict(**pathwaySelection())
    if effortSharing in ["PC", "PCC", "AP", "GDR", "ECPC"]:
        selection.update(Scenario="SSP2")
    if effortSharing == "PCC":
        selection.update(Convergence_year=2040)

    file_by_year = {
        "2030": ds_alloc_2030,
        "2040": ds_alloc_2040,
        "2050": ds_alloc_2050,
        "2021-2100": ds_alloc_FC,
    }

    df = (
        (
            file_by_year[year][effortSharing]
            .sel(**selection)
            .mean(dim="TrajUnc")  # TODO: sel "Medium" instead of calculate mean?
            / population_map(year=2021)
        )
        .rename(Region="ISO")
        .to_series()
        .rename("value")
        .dropna()  # Note: dropping NaN values here
        .reset_index()
    )
    rows = df.to_dict(orient="records")

    domain = [
        min(rows, key=lambda x: x["value"])["value"],
        max(rows, key=lambda x: x["value"])["value"],
    ]
    # Floating randomness make plot look weird for pc
    # [222.999999322, 223.00000067800002]
    # added fudge factor
    if effortSharing == "PC" or (effortSharing == "PCC" and year == "2040"):
        domain = [
            domain[0] - 1,
            domain[1] + 1,
        ]

    # TODO calculate domain from all principles
    # ECPC is much bigger then other principles, so looks weird
    # domainds = file_by_year[year].sel(
    #     Scenario="SSP2",
    #     Convergence_year=2040,
    #     **pathwaySelection())
    # domain_std = domainds.std()
    # domain_mean = domainds.mean()
    # sigma = 1
    # raw_domain = [
    #     domain_mean - (sigma * domain_std),
    #     domain_mean + (sigma * domain_std),
    # ]
    # domain = [
    #     min([v.values.tolist() for v in raw_domain[0].values()]),
    #     max([v.values.tolist() for v in raw_domain[1].values()])
    # ]
    # print(domain)

    return {"data": rows, "domain": domain}


# Reference pathway data (xr_policyscen.nc)
ds_policyscen = xr.open_dataset("data/xr_policyscen.nc")


@app.get("/policyPathway/<policy>/<region>")
def policyPathway(policy, region):
    assert policy in {"CurPol", "NDC", "NetZero"}
    policy_ds = (
        ds_policyscen[policy].sel(Region=region, Time=slice(2021, 2100)).drop("Region")
    )
    # Not all countries have data for all policies, so return None if no data
    if policy_ds.isnull().all():
        return jsonify(None)

    policy_ds = policy_ds.groupby("Time")

    # TODO precompute mean, min and max
    # instead of calculating them on the fly each time
    df = xr.merge(
        [
            policy_ds.mean(["Model"]).rename("mean"),
            policy_ds.min(["Model"]).rename("min"),
            policy_ds.max(["Model"]).rename("max"),
        ]
    ).to_pandas()

    if region == "EARTH":
        df /= 1000  # global GHG in Gt CO2e

    df.index.rename("time", True)
    return df.reset_index().to_dict(orient="records")


def ndcAmbition(region):
    ndc2030 = ds_policyscen.NDC.sel(Region=region, Time=2030).mean().values.tolist()
    if np.isnan(ndc2030):
        return None
    hist1990 = dsGlobal.GHG_hist.sel(Region=region, Time=1990).values.tolist()
    return -(ndc2030 - hist1990) / hist1990 * 100


def historicalCarbonIndicator(region, start, end):
    return (
        dsGlobal.GHG_hist.sel(Region=region, Time=slice(start, end))
        .sum()
        .values.tolist()
    )


@app.get("/indicators/<region>")
def indicators(region):
    start = request.args.get("start", 1850)
    end = request.args.get("end", 2100)
    data = {
        "ndcAmbition": ndcAmbition(region),
        "historicalCarbon": historicalCarbonIndicator(region, start, end),
    }
    return data


# Country-specific data (xr_alloc_<ISO>.nc)


def get_ds(ISO):
    return xr.open_dataset(f"data/xr_alloc_{ISO}.nc")


@app.get("/<ISO>/<principle>")
def effortSharing(ISO, principle):
    selection = dict(
        **pathwaySelection(),
    )

    # TODO should I do aggregation on Scenario and Convergence_year?
    # or use static selection?
    if principle in ["PC", "PCC", "AP", "GDR", "ECPC"]:
        selection.update(Scenario="SSP2")
    if principle == "PCC":
        selection.update(Convergence_year=2040)

    ds = get_ds(ISO)[principle].sel(**selection)
    df = ds.rename(Time="time").to_pandas()
    if principle in ["GF", "PC", "ECPC"]:
        # These effort sharing principles have Time dimension after TrajUnc dimension
        # While all other principles have TrajUnc dimension after Time dimension
        # Causing columns to be Time and TrajUnc to be rows in dataframe
        # We want the opposite
        # TODO order dimensions for each principle in same way, so this is not needed anymore

        df = df.transpose()

    return (
        df.agg(["mean", "min", "max"], axis=1).reset_index().to_dict(orient="records")
    )


principles = {"PC", "PCC", "AP", "GDR", "ECPC", "GF"}


@app.get("/<ISO>/effortSharings")
def effortSharings(ISO):
    """
    http://127.0.0.1:5000//USA/GF?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 36.94ms
    http://127.0.0.1:5000//USA/PC?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 38.556ms
    http://127.0.0.1:5000//USA/PCC?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 37.553ms
    http://127.0.0.1:5000//USA/AP?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 37.296ms
    http://127.0.0.1:5000//USA/GDR?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 37.304ms
    http://127.0.0.1:5000//USA/ECPC?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 10.238ms
    36.94 + 38.56 + 37.55 + 37.29 + 37.30 + 10.23 = 197.869

    http://127.0.0.1:5000//USA/effortSharings?exceedanceRisk=0.67&negativeEmissions=0.4&effortSharing=PCC&temperature=1.8: 221.552ms
    """
    return {k: effortSharing(ISO, k) for k in principles}


@app.get("/<ISO>/effortSharingReductions")
def effortSharingReductions(ISO):
    periods = (2030, 2040)
    selection = dict(
        **pathwaySelection(),
        Time=periods,
    )

    hist = dsGlobal.GHG_hist.sel(Region=ISO, Time=1990).values + 0

    reductions = {}
    for principle in principles:
        pselection = selection.copy()
        if principle in ["PC", "PCC", "AP", "GDR", "ECPC"]:
            pselection.update(Scenario="SSP2")
        if principle == "PCC":
            pselection.update(Convergence_year=2040)
        reductions[principle] = {}
        for period in periods:
            pselection.update(Time=period)
            es = get_ds(ISO)[principle].sel(**pselection).mean().values + 0
            reductions[principle][period] = -(es - hist) / hist * 100

    return reductions
