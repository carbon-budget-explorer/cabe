import type { NetCDFReader } from 'netcdfjs';

export interface SpatialMetric {
	ISO: string;
	value: number;
}

export interface NamedSpatialMetric extends SpatialMetric {
	name: string;
}

export interface NamedRegion {
	ISO: string;
	name: string;
}

export interface TemnporalMetric {
	Time: number;
	value: number;
}

function getVariableInfo(file: NetCDFReader, variable: string) {
	const var_info = file.variables.find((v) => v.name === variable);
	if (!var_info) {
		throw new Error(`Variable ${variable} not found`);
	}
	return var_info;
}

export function getVariableDimensions(file: NetCDFReader, variable: string) {
	const var_info = getVariableInfo(file, variable);
	const dims = file.dimensions;
	return var_info.dimensions.map((d) => dims[d]);
}

export function getVariableShape(file: NetCDFReader, variable: string) {
	return getVariableDimensions(file, variable).map((d) => d.size);
}

export function getStringVariable(file: NetCDFReader, variable: string) {
	const raw = file.getDataVariable<string>(variable);
	const values = [];
	const shape = getVariableShape(file, variable);
	const strLength = shape[shape.length - 1];
	for (let i = 0; i < raw.length; i += strLength) {
		const value = raw
			.slice(i, i + strLength)
			.join('')
			.trimEnd();
		// TODO length check should not be needed?
		if (value.length > 0) {
			values.push(value);
		}
	}
	return values;
}
