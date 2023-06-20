# Carbon Budget Explorer (CABE)

Web application to explore carbon budgets

## Developing

You'll need [node.js](https://nodejs.org/en) to run a local development server.
Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Data preparation

The data is prepared using the [data preparation script](dataprep/dataprep.ipynb). The data is stored in the [data folder](data).

Install with mamba using

```bash
mamba env create  -f dataprep/environment.yml
conda activate cabe
```

Run notebooks with

```bash
jupyter run dataprep/dataprep.ipynb dataprep/borders.ipynb
```
