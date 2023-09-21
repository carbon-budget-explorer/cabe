import type { PyodideInterface } from 'pyodide';

export function mount_data(root: string, pyodide: PyodideInterface) {
	console.log('Mounting ', root, ' as ', root);
	pyodide.FS.mkdir(root);
	pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root }, root);
}

export async function open_pyodide(): Promise<PyodideInterface> {
	// Using CommonJS import because the ES module of pyodide
	// gives errors of `file://` in paths.
	const pyodide_module = await import('pyodide/pyodide.js');
	// In dev mode pyodide_module.loadPyodide is set
	// In prod mode pyodide_module.default.loadPyodide is set
	const loadPyodide = pyodide_module.loadPyodide || pyodide_module.default.loadPyodide;
	const pyodide: PyodideInterface = await loadPyodide();
	return pyodide;
}

export async function open_dataset(path: string, pyodide: PyodideInterface) {
	// TODO dont install and talk to internet again
	// but without installing then nothing is installed
	// while the whl files are in the pyodide folder
	await pyodide.loadPackage('micropip');
	const micropip = pyodide.pyimport('micropip');
	await micropip.install('xarray');
	await micropip.install('netcdf4');

	const xarray = pyodide.pyimport('xarray');
	const ds = xarray.open_dataset(path);
	// TODO create type for ds
	// now copy from Python and handle convertsion with guesswork
	console.log(`Opened ${path} with pyodide+xarray`);
	return ds;
}

export function slice(pyodide: PyodideInterface, start: number, stop?: number, step?: number) {
	const slice = pyodide.globals.get('slice');
	if (step !== undefined && stop !== undefined) {
		return slice(start, stop, step);
	} else if (stop !== undefined) {
		return slice(start, stop);
	}
	return slice(start);
}

export type CoordinateSelection = string | number | string[] | number[] | undefined;

export type DataArraySelection = Record<string, CoordinateSelection> | undefined;
