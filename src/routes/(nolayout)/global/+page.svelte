<script lang="ts">
	import type { PageData } from '../../global/$types';

	import GlobalBudgetForm from '$lib/GlobalBudgetForm.svelte';
	export let data: PageData;
</script>

<div class="border-grey-4 border-grey flex flex h-full w-full flex-col items-center border-4">
	<div class="steps py-8">
		<ol class="w-full items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
			<li class="flex items-center space-x-2.5 text-blue-600 dark:text-blue-500">
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-600 dark:border-blue-500"
				>
					1
				</span>
				<span>
					<h3 class="font-medium leading-tight">Construct your scenario</h3>
				</span>
			</li>
			<li class="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400"
				>
					2
				</span>
				<span>
					<h3 class="font-medium leading-tight">Choose your effort-sharing method</h3>
				</span>
			</li>
			<li class="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400"
				>
					3
				</span>
				<span>
					<h3 class="font-medium leading-tight">Get country details</h3>
				</span>
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400"
				>
					4
				</span>
				<span>
					<h3 class="font-medium leading-tight">Compare</h3>
				</span>
			</li>
		</ol>
	</div>
	<div class="flex h-full w-full flex-row justify-between gap-4">
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-xl">Choosing your pathway</h1>
				<h2>(Wat wil ik?)</h2>
			</div>
			<div class="border-grey-400 border-4">
				<GlobalBudgetForm choices={data.choices} query={data.query} onChange={() => 1} />
			</div>
			<div class="border-grey-400 border-4">
				<ul>
					<li>Global budget: XXX GtCO2</li>
					<li>Used since 1850-2021: XXX GtCO2</li>
					<li>Remaining till 2050: XXX GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex grow flex-col gap-4">
			<div class="border-grey-400 grow border-4" id="imagecontainer" />
			<div class="border-grey-400 border-4">
				<h1>Difference between your scenario and current policy</h1>
				<ul>
					<li>Ambition gap: XXX GtCO2</li>
					<li>Emission gap: XXX GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex h-full flex-col justify-between gap-4">
			<div>
				<h1 class="text-xl">Policy pathways</h1>
				<!-- <h2>(Currenty policy)</h2> -->
				<h2>(Waar kom ik nu eigenlijk?)</h2>
			</div>
			<div class="border-grey-400 grow border-4">
				<ul>
					<li><label><input type="checkbox" checked />{' '}Current policy</label></li>
					<li>
						<label><input type="checkbox" />{' '}Nationally determined contributions (NDCs)</label>
					</li>
					<li><label><input type="checkbox" />{' '}Net zero-scenarios</label></li>
				</ul>
			</div>

			<div>
				<button
					class="mb-2 mr-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-3xl font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
				>
					Next step: allocate
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	#imagecontainer {
		background: url('https://private-user-images.githubusercontent.com/17080502/255811842-a72cfb8b-d325-4bcb-8161-209b7f8ae732.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTE1MDI1MjgsIm5iZiI6MTY5MTUwMjIyOCwicGF0aCI6Ii8xNzA4MDUwMi8yNTU4MTE4NDItYTcyY2ZiOGItZDMyNS00YmNiLTgxNjEtMjA5YjdmOGFlNzMyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzA4MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMwODA4VDEzNDM0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI0ZDc5N2NjNmQ3NWVmZWQwYzM5M2E4YmExMzAwNDY4ZWU0OTZkMmEwY2JmZTBlMGEwNDc5MTA4ZDg1MWZiMmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.bKX5pbRv32EvSaRbdr4_spGJq4ajD0WY9uPe22eG8Gc')
			no-repeat;
		background-size: contain;
	}
</style>
