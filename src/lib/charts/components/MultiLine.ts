export type LineValue = {
	x: number;
	y: number;
	y0: number;
	y1: number;
	group: string;
};

export type LineData = {
	group: string;
	stroke: string;
	fill: string;
	values: LineValue[];
};
