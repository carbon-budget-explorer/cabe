// Top colors from https://venngage.com/tools/accessible-color-palette-generator

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
