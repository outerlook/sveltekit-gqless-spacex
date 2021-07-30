<script lang='ts'>
	import "virtual:windi.css"

	// if you want to enable windi devtools
	import { browser } from "$app/env";
	import { setClient } from '$lib/svelte-gqless/setup';
	if (browser) import("virtual:windi-devtools")

	setClient()
</script>

<slot/>