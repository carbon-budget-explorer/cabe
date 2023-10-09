// import {pythonBridge}  from 'python-bridge';

// const python = pythonBridge({
// 	python: '/home/verhoes/mambaforge/envs/cabe/bin/python',
// 	cwd: '/home/verhoes/git/carbon-budget-explorer/cabe'
// });

// async function pr(literals: TemplateStringsArray | string, ...placeholders: any[]) {
// 	return new Promise((resolve, reject) => {
// 		python(literals, ...placeholders)
// 			.then(resolve)
// 			.catch(reject);
// 	});
// }

// python.ex`
// import xarray as xr

// ds = xr.open_dataset("data/xr_alloc_USA.nc")


// def getEffortSharings():
//     r = {}
//     q = [
//         {
//             "principle": "GF",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//             },
//         },
//         {
//             "principle": "PC",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//                 "Scenario": "SSP2",
//             },
//         },
//         {
//             "principle": "PCC",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//                 "Convergence_year": 2040,
//                 "Scenario": "SSP2",
//             },
//         },
//         {
//             "principle": "AP",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//                 "Scenario": "SSP2",
//             },
//         },
//         {
//             "principle": "GDR",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//                 "Scenario": "SSP2",
//             },
//         },
//         {
//             "principle": "ECPC",
//             "selection": {
//                 "Temperature": "2.3",
//                 "Risk": "0.2",
//                 "NegEmis": "0.6",
//                 "NonCO2": "0.2",
//                 "Scenario": "SSP2",
//             },
//         },
//     ]

//     for p in q:
//         pr = p["principle"]
//         rp = getattr(ds, pr).sel(**p["selection"])
//         if pr == "ECPC":
//             unc = rp.to_pandas().agg(["mean", "min", "max"]).transpose().to_dict()
//             r[pr] = {
//                 "time": "2100",
//                 "mean": unc["mean"],
//                 "min": unc["min"],
//                 "max": unc["max"],
//             }
//         else:
//             df = rp.rename(Time="time").to_pandas()
//             if pr in {"GF", "PC"}:
//                 df = df.transpose()
//             r[pr] = (
//                 df.agg(["mean", "min", "max"], axis=1).reset_index().to_dict(orient="records")
//             )
//     return r
// `;

// export const GET = async () => {
// 	const effortSharingData = await pr(`getEffortSharings()`);
//     console.log(effortSharingData);
// 	return new Response(String(JSON.stringify(effortSharingData)));
// };

export const GET = async () => {
	return new Response(String(JSON.stringify({msg:'build error'})));
};