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
