/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				'2xl': '1680px'
			}
		}
	},
	plugins: [require('@tailwindcss/forms'), require('daisyui'), require('@tailwindcss/typography')],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#0069AA',
					secondary: '#0099D9',
					accent: '#A9C810',
					neutral: '#2B5161',
					'base-100': '#ffffff',
					info: '#3abff8',
					success: '#36d399',
					warning: '#fbbd23',
					error: '#f87272',
					'--rounded-box': '0.5rem'
				}
			}
		]
	}
};
