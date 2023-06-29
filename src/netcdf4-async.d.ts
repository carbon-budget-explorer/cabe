declare module 'netcdf4-async' {
    export function open(path: string, mode: string): Promise<NetCDFFile>;
    export class NetCDFFile {
        root: NetCDFGroup;
    }
    export class NetCDFGroup {
        getVariable(name: string): Promise<NetCDFVariable>;
    }
    export class NetCDFVariable {
        getDimensions(): Promise<Record<string, number>>;
        readSlice<R extends string | number[] = number[]>(...args: number[]): Promise<R>;
    }
}