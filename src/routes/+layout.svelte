<script lang="ts">
	import "../app.css"
	import { setLightningContext } from '$lib/lightning.svelte';
	import Header from './components/Header.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import ThumbNav from './components/ThumbNav.svelte';
	import { fade } from 'svelte/transition';
	import { quartIn } from 'svelte/easing';
	import AppLayout from "$lib/components/AppLayout.svelte";

	let {  children, data }  = $props();

	let url = page.url

	setLightningContext()

</script>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<AppLayout>
	<Header></Header>
	<main class="relative flex-1 mb-4">
		{#key data.url}
			<div class="pageWrapper absolute inset-0 w-full-h-full"
				in:fade={{duration: 500, easing: quartIn}} 
				out:fade={{duration:500}}
			>
				{@render children()}
			</div>	
		{/key}
	</main>
	<ThumbNav></ThumbNav>
</AppLayout>

<style>
	
:global {

	* {
		box-sizing: border-box;
		font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}

    button {
        cursor: pointer
    }
}

</style>