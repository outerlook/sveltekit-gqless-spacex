<script lang='ts'>
	import { createReadableQuery } from '$lib/svelte-gqless/queryStore';

	const query$ = createReadableQuery();

	let limit = 10;

	$: launches = $query$.launchesPast({ limit });
</script>

<section class='mt-5'><h1 class='text-lg font-bold'>{limit} previous launches</h1>
	<div class='p-2'>
		{#each launches as launch}
			<details class='mb-2'>
				<summary class='cursor-pointer'>{launch.mission_name}</summary>
				<p class='p-2 text-gray-700 text-sm'>{launch.details ?? "No details"}</p>
			</details>
		{/each}
	</div>
</section>

<label>Edit the number of mission displayed
	<input bind:value={limit} class='border-gray-400 p-s border-solid border' type='number' />
</label>

<style lang='scss'>
  h1 {

  }
</style>