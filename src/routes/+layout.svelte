<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LightningNodes } from '$lib/types';
	import { getLightning, setLightningContext } from '$lib/lightning.svelte';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';

	type $$Props = {
		data: {
			nodes: LightningNodes
		},
		children: Snippet
	}
	let { data, children } : $$Props = $props();

	setLightningContext()
	const lightning = getLightning()

	$effect(() => {
		lightning.nodes = data.nodes
	})

</script>

<Header></Header>
<main class="relative flex-1">
	{@render children()}
</main>
<Footer></Footer>

<style>
	:global(body) {
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background-color: #131313;
	}
</style>