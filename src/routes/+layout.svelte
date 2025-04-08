<script lang="ts">
	import { setLightningContext } from '$lib/lightning.svelte';
	import Header from './components/Header.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import ThumbNav from './components/ThumbNav.svelte';

	let {  children }  = $props();

	let url = page.url

	setLightningContext()

</script>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<Header></Header>
<main class="relative flex-1">
	{#key url}
			{@render children()}
	{/key}
</main>
<ThumbNav></ThumbNav>

<style>
	
:global {

	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background-color: #131313;
	}
}
</style>