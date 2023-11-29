// Top colors from https://colorbrewer2.org/#type=qualitative&scheme=Set3&n=9
/*
#8dd3c7
#ffffb3
#bebada
#fb8072 to much like ndc
#80b1d3
#fdb462
#b3de69 to much like pathway
#fccde5
#d9d9d9
*/
export const principles = {
	GF: {
		label: 'Grandfathering',
		summary: 'Past emissions levels.',
		color: '#0a3dda'
	},
	PC: {
		label: 'Per capita',
		summary: 'Population.',
		color: '#8b10c8'
	},
	PCC: {
		label: 'Per capita convergence',
		summary: 'Population with convergence in 2040.',
		color: '#d01581'
	},
	AP: {
		label: 'Ability to pay',
		summary: 'A country’s ability to pay for mitigation.',
		color: '#00afaf'
	},
	GDR: {
		label: 'GH development rights',
		summary: 'Equalize per capita emissions across countries.',
		color: '#dc9a00'
	},
	ECPC: {
		label: 'Equal cumulative per capita',
		summary: 'A country’s cumulative emissions per capita.',
		color: '#ae6600'
	}
} as const;
