// Top colors from https://colorbrewer2.org/#type=qualitative&scheme=Pastel1&n=9
export const principles = {
	GF: {
		label: 'Grandfathering',
		summary: 'Past emissions levels.',
		color: '#fbb4ae'
	},
	PC: {
		label: 'Per capita',
		summary: 'Population.',
		color: '#b3cde3'
	},
	PCC: {
		label: 'Per capita convergence',
		summary: 'Population with convergence in 2040.',
		color: '#ccebc5'
	},
	AP: {
		label: 'Ability to pay',
		summary: 'A country’s ability to pay for mitigation.',
		color: '#decbe4'
	},
	GDR: {
		label: 'Greenhouse development rights',
		summary: 'Equalize per capita emissions across countries.',
		color: '#fed9a6'
	},
	ECPC: {
		label: 'Equal cumulative per capita',
		summary: 'A country’s cumulative emissions per capita.',
		color: '#ffffcc'
	}
} as const;
