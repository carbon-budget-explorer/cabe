declare module 'netcdfjs' {
	export interface NetCDFAttribute {
		readonly name: string;
		readonly type: string;
		readonly value: string | number | NaN;
	}

	export interface NetCDFVariable {
		readonly name: string;
		readonly dimensions: number[];
		readonly type: string;
		readonly size: number;
		readonly offset: number;
		readonly record: boolean;
		readonly attributes: NetCDFAttribute[];
	}

	export interface NetCDFDimension {
		readonly name: string;
		readonly size: number;
	}

	export class NetCDFReader {
		constructor(buffer: BufferSource);
		readonly dimensions: NetCDFDimension[];
		readonly variables: NetCDFVariable[];
		getDataVariable<T extends number | string = number>(name: string): T[];
	}
}
