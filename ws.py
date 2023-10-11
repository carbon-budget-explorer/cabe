"""

Install with

    pip install flask gunicorn

Run with

    gunicorn -w 4 'ws:app'

"""

import time
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
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
            },
        },
        {
            "principle": "PC",
            "selection": {
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "PCC",
            "selection": {
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
                "Convergence_year": 2040,
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "AP",
            "selection": {
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "GDR",
            "selection": {
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
                "Scenario": "SSP2",
            },
        },
        {
            "principle": "ECPC",
            "selection": {
                "Temperature": "1.5",
                "Risk": "0.5",
                "NegEmis": "0.5",
                "NonCO2": "0.5",
                "Scenario": "SSP2",
            },
        },
    ]

    for p in q:
        pr = p["principle"]
        rp = getattr(ds, pr).sel(**p["selection"])
        if pr == "ECPC":
            unc = (
                rp.to_pandas()
                .agg(["mean", "min", "max"])
                .transpose()
                .to_dict()
            )
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
                df.agg(["mean", "min", "max"], axis=1)
                .reset_index()
                .to_dict(orient="records")
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
