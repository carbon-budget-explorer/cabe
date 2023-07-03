# Carbon Budget Explorer (CABE)

Web application to explore carbon budgets

## Data requirements

Should have the following data files:

1. `data/xr_total.nc` - NetCDF v3 file with totals
2. `data/xr_budgets_scenario.nc`- NetCDF v3 file with scenarios
3. `data/ne_110m_admin_0_countries.geojson` - can be downloaded with `npm run download:borders`

## Developing

You'll need [node.js](https://nodejs.org/en) to run a local development server.
Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Formatting & linting

The code is formatted with [Prettier](https://prettier.io/) using

```bash
npm run format
```

The code can be linted, using Prettier and eslint, with

```bash
npm run lint
```

The code can be checked with

```bash
npm run check
```

## Testing

The unit test can be run with
    
```bash 
npm run test:unit
```

For coverage, run

```bash
npm run test:unit -- run --coverage
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
