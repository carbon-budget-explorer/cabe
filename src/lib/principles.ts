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
		summary: 'Continuity. Based on current emission levels',
		color: '#8dd3c7'
	},
	PC: {
		label: 'Per capita',
		summary: 'Equality. Based on current population levels.',
		color: '#f5e663'
	},
	PCC: {
		label: 'Per capita convergence',
		summary: 'Continuity and equality. Converging from grandfathering to per capita in 2050.',
		color: '#bebada'
	},
	AP: {
		label: 'Ability to pay',
		summary: 'Capability. Based on GDP per capita',
		color: '#80b1d3'
	},
	GDR: {
		label: 'Greenhouse development rights',
		summary:
			'Capability + Responsibility. Based on GDP per capita and a responsibility-capability index.',
		color: '#fdb462'
	},
	ECPC: {
		label: 'Equal cumulative per capita',
		summary:
			'Responsibility + Equality. Based on historical emissions and the past and future per capita share.',
		color: '#fccde5'
	}
} as const;
