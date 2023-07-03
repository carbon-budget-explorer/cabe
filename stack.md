# Stack

First prototype should be able to:

- Make a chloropleth map of countries coloured by some input data read from a file
- When you click a region, it should display more info, including
- A line chart showing data over time for the given region

Requirements:

- Hosted on Azure
- Easy to add new data (by scientists)
- Easy to change text content (some sort of markdown cms)

## Meta Framework + component framework

- **sveltekit + svelte**
  - Very fast / compiled / true reactivity
- nuxt + vue
  - Easy to learn
- nextjs + react
  - Stable
- remix + react
  - Fuzzy mix of server/client side rendering
- qwik
  - Uses their own components?
  - Up and coming
- ~astro~ + solidjs / react / vue / svelte
  - Astro focused on content rich websites, less on web applications
- ~solidstart~ + solidjs
  - Solidjs looks nice, but solidstart still in beta

## Visualization

vega / vega-lite / altair / vega-embed
plotly
d3
nivo (react only)

## Data

The data is in netcdf v3 format.

To read data in Javascript we could

- Convert to json with Python script
  - Multi language
  - big conda environment
  - JSON file is big
- Use netcdf4-async library
  - Give segmentation fault during build and test:unit command when threads are cleaning up
  - has issue about memory leak
- Use netcdf4 library
  - Does not compile with node v18
- Use netcdf4-node library
  - Requires Python with xarray
  - Too many dependencies
- Use zarrjs library
  - need conversion to zarr format with xarray
  - zarrjs is unable to read string variable
- Use wasm version of netcdf
  - Example on Internet broken
  - Tried with emscripten, but got stuck on building deps
  - Tried with rust, but got stuck on building deps
- **Use netcdfjs library**
  - no OS dependencies
  - only netcdf3 supported, not netcdf4
  - whole file in memory
- Convert to sqlite / csv
  - Needs Python script
