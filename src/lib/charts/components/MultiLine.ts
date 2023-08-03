export type LineValue = {
	x: number;
	y: number;
	ymin: number;
	ymax: number;
};

export type LineData = {
	name: string;
	stroke: string;
	fill: string;
	values: LineValue[];
};
