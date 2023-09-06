import {dirname, basename } from 'node:path';
import type { PyodideInterface } from 'pyodide';

export async function open_pyodide(): Promise<PyodideInterface> {
	// TODO replace require() with es import, 
	// but gives following error:
	// Error: Cannot find module '/home/verhoes/git/carbon-budget-explorer/cabe/file:/home/verhoes/git/carbon-budget-explorer/cabe/node_modules/src/js/pyodide.asm.js' imported from /home/verhoes/git/carbon-budget-explorer/cabe/node_modules/pyodide/pyodide.mjs
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { loadPyodide } = require('pyodide');
	
	const pyodide: PyodideInterface = await loadPyodide();
	return pyodide;
}

export function slice(pyodide: PyodideInterface, start: number, stop?: number, step?: number) {
	console.log(pyodide.globals)
	const slice = pyodide.globals.get('slice')
	console.log(slice)
	if (step !== undefined && stop !== undefined) {
		return slice(start, stop, step)
	} else if (stop !== undefined) {
		return slice(start, stop)
	}
	return slice(start)
}

export async function open_dataset(path: string, pyodide: PyodideInterface) {
	// TODO dont install and talk to internet again
	// but without installing then nothing is installed
	// while the whl files are in the pyodide folder
	await pyodide.loadPackage('micropip');
	const micropip = pyodide.pyimport('micropip');
	await micropip.install('xarray');
	await micropip.install('netcdf4');

	const xarray = pyodide.pyimport("xarray");

	const root = dirname(path)
	const mountDir = "/mnt";
	pyodide.FS.mkdir(mountDir);
	pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root }, mountDir);
	const ds = xarray.open_dataset(`${mountDir}/${basename(path)}`)
	// TODO create type for ds
	// now copy from Python and handle convertsion with guesswork
	return ds
}

export type CoordinateSelection =
	| string
	| number
	| string[]
	| number[]
	| undefined;

export type DataArraySelection = Record<string, CoordinateSelection> | undefined;
