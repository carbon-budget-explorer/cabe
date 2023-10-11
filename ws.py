"""

Install with

    pip install flask gunicorn

Run with

    gunicorn -w 4 'ws:app'

"""

import xarray as xr

from flask import Flask, request

app = Flask(__name__)


# TODO improve endpoint names
# TODO use class-based views for a reusable nc-file viewer?
# TODO write tests with dummy data
# TODO validate inputs?


# Global data (xr_dataread.nc)
dsGlobal = xr.open_dataset("data/xr_dataread.nc")


@app.get("/pathwayCarbon")
def pathwayCarbon():
    """Get global carbon pathway for a given selection.

    To test:
    production server:
    http://127.0.0.1:8000/pathwayCarbon?nonCO2Mitigation=0.5&exceedanceRisk=0.5&negativeEmissions=0.5

    dev server:
    http://127.0.0.1:5000/pathwayCarbon?nonCO2Mitigation=0.5&exceedanceRisk=0.5&negativeEmissions=0.5
    """
    df = (
        dsGlobal.CO2_globe.sel(
            # TODO remove defaults
            # TODO use request.data instead of request.args?
            Temperature=request.args.get("temperature", 1.5),
            Risk=request.args.get("exceedanceRisk", 0.5),
            NegEmis=request.args.get("negativeEmissions", 0.5),
            NonCO2=request.args.get("nonCO2Mitigation", 0.5),
            Time=slice(2021, 2100),
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
        "nonCO2Mitigation": dsGlobal.NonCO2.values.tolist(),
        "negativeEmissions": dsGlobal.NegEmis.values.tolist(),
    }


@app.get("/regions")
def regions():
    return dsGlobal.Region.values.tolist()


@app.get("/pathwayStats")
def pathwayStats():
    used = dsGlobal.CO2_hist.sel(Region="WORLD").sum().values.tolist()
    remaining = (
        dsGlobal.CO2_globe.sel(
            Temperature=request.args.get("temperature", 1.5),
            Risk=request.args.get("exceedanceRisk", 0.5),
            NegEmis=request.args.get("negativeEmissions", 0.5),
            NonCO2=request.args.get("nonCO2Mitigation", 0.5),
            TrajUnc="Medium",
        )
        .sum()
        .values.tolist()
    )
    total = used + remaining

    return {"total": total, "used": used, "remaining": remaining}


@app.get("/historicalCarbon/<region>")
def historicalCarbon(region="WORLD"):
    start = request.args.get("start")
    end = request.args.get("end")
    df = dsGlobal.CO2_hist.sel(
        Region=region, Time=slice(start, end)
    ).to_pandas()
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
# ds_alloc_2040 = xr.open_dataset("data/xr_alloc_2040.nc")


@app.get("/fullCenturyBudgetSpatial")
def fullCenturyBudgetSpatial():
    effortSharing = request.args.get("effortSharing", "PCC")
    selection = dict(
        Temperature=request.args.get("temperature", 1.5),
        Risk=request.args.get("exceedanceRisk", 0.5),
        NegEmis=request.args.get("negativeEmissions", 0.5),
        NonCO2=request.args.get("nonCO2Mitigation", 0.5),
    )
    if effortSharing in ["PC", "PCC", "AP", "GDR", "ECPC"]:
        selection.update(Scenario="SSP2")
    if effortSharing == "PCC":
        selection.update(Convergence_year=2040)

    # TODO make it possible to choose 2040
    df = ds_alloc_2030[effortSharing].sel(**selection).to_pandas()

    # Taking mean over TrajUnc dimension
    # TODO should we pin TrajUnc to a specific value? Or take max or min?
    df = df.agg(func="mean", axis=1).dropna()  # Note: dropping nan values here

    # Index is called Region and column is unnamed
    df.index.rename("ISO", True)
    df = df.reset_index()
    df["value"] = df.pop(0)
    return df.to_dict(orient="records")


# Reference pathway data (xr_policyscen.nc)
ds_policyscen = xr.open_dataset("data/xr_policyscen.nc")


@app.get("/policyPathway/<policy>/<region>")
def policyPathway(policy, region):
    policy_ds = (
        ds_policyscen[policy]
        .sel(Region=region, Time=slice(2021, 2100))
        .drop("Region")
        .groupby("Time")
    )

    # TODO precompute mean, min and max
    # instead of calculating them on the fly each time
    df = xr.merge(
        [
            policy_ds.mean(["Model"]).rename("mean"),
            policy_ds.min(["Model"]).rename("min"),
            policy_ds.max(["Model"]).rename("max"),
        ]
    ).to_pandas()
    df.index.rename("time", True)
    return df.reset_index().to_dict(orient="records")
