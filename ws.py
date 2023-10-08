"""

Install with

    pip install flask gunicor

Run with

    gunicorn -w 4 'ws:app'

"""

import time
from starlette.responses import JSONResponse
from fastapi.responses import ORJSONResponse, UJSONResponse
import xarray as xr

from flask import Flask
app = Flask(__name__)

# from fastapi import FastAPI
# app = FastAPI()

ds = xr.open_dataset("data/xr_alloc_USA.nc")


def getEffortSharings():
    r = {}
    q = [
        {
            "principle": "GF",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
            },
        },
        {
            "principle": "PC",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "PCC",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
                "Convergence_year": 2040,
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "AP",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "GDR",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "ECPC",
            "selection": {
                "Temperature": "2.3",
                "Risk": "0.2",
                "NegEmis": "0.6",
                "NonCO2": "0.2",
                "Scenario": "SSP2",
            },
        },
    ]

    for p in q:
        pr = p["principle"]
        rp = getattr(ds, pr).sel(**p["selection"])
        if pr == "ECPC":
            unc = rp.to_pandas().agg(["mean", "min", "max"]).transpose().to_dict()
            r[pr] = {
                "time": "2100",
                "mean": unc["mean"],
                "min": unc["min"],
                "max": unc["max"],
            }
        else:
            df = rp.rename(Time="time").to_pandas()
            if pr in {"GF", "PC"}:
                df = df.transpose()
            r[pr] = (
                df.agg(["mean", "min", "max"], axis=1).reset_index().to_dict(orient="records")
            )
    return r


# @app.route("/")
@app.get("/")
def hello_world():
    t = time.process_time()

    effortSharings = getEffortSharings()

    elapsed_time = time.process_time() - t
    # print(effortSharings)
    print("Elapsed time: ", elapsed_time)
    # return elapsed_time
    return effortSharings
