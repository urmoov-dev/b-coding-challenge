<script lang="ts">
	import { setLightningContext } from '$lib/lightning.svelte';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import { page } from '$app/state';

	let {  children }  = $props();

	let url = page.url

	$inspect(page)

	setLightningContext()

</script>

<Header></Header>
<main class="relative flex-1">
	{#key url}
		<div class="absolute">
			{@render children()}
		</div>
	{/key}
</main>
<Footer></Footer>

<style>
	:global(body) {
		margin: 0;
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background-color: #131313;
	}
</style>