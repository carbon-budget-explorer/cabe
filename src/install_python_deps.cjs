async function main() {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { loadPyodide } = require('pyodide');
	const pyodide = await loadPyodide();
	await pyodide.loadPackage('micropip');
	const micropip = pyodide.pyimport('micropip');
	await micropip.install('xarray');
	await micropip.install('netcdf4');

    const xarray = await pyodide.pyimport("xarray");
    console.log(xarray.__version__)

    // TODO use lock file to install deps
    // const lock = await micropip.freeze();
    // console.log(lock)
}

main().catch(console.error);
