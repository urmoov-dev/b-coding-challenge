<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';

	type $$Props = {
		data: {},
		children: Snippet
	}

	let { data, children } = $props();

	$inspect(data)

</script>

{@render children()}
