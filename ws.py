"""

Install with

    pip install flask gunicorn

Run with

    gunicorn -w 4 'ws:app'

"""

import xarray as xr

from flask import Flask, request

app = Flask(__name__)

dsGlobal = xr.open_dataset("data/xr_dataread.nc")


# TODO improve endpoint names
# TODO maybe use https://github.com/linsomniac/flask-publisher ?
# TODO remove defaults?
# TODO use request.data instead of request.args?
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
