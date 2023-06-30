declare module 'netcdf4-async' {
	export function open(path: string, mode: string): Promise<NetCDFFile>;
	export class NetCDFFile {
		root: NetCDFGroup;
		sync(): Promise<void>;
		close(): Promise<void>;
	}
	export class NetCDFGroup {
		getVariables(): Promise<Record<string, NetCDFVariable>>;
		getVariable(name: string): Promise<NetCDFVariable>;
		addDimension(name: string, length: number): Promise<void>;
		addVariable(name: string, type: string, dimensions: string[]): Promise<NetCDFVariable>;
	}
	export class NetCDFVariable {
		name: string;
		type: string;
		getDimensions(): Promise<Record<string, number>>;
		readSlice<R extends string | string[] | number[] = number[]>(...args: number[]): Promise<R>;
		writeSlice(
			pos: number,
			size: number,
			valuearray: Float64Array | Int32Array | string[]
		): Promise<void>;
		writeSlice(
			pos: number,
			size: number,
			pos2: number,
			size2: number,
			valuearray: Float64Array | Int32Array | string[]
		): Promise<void>;
		writeSlice(
			pos: number,
			size: number,
			pos2: number,
			size2: number,
			pos3: number,
			size3: number,
			valuearray: Float64Array | Int32Array | string[]
		): Promise<void>;
	}
}
