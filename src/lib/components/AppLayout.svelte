<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { getLayoutState, setLayoutState } from "./layout-state.svelte";
	import { browser } from "$app/environment";

	setLayoutState()
    let layout = getLayoutState()

	let { children } = $props();

	let lastHeight =$state(0)
	let lastJump = $state(0)
	let landscapeHeight = $state(0)
	let portraitHeight = $state(0)
	let turnedPortrait = $state(0)

	function handleViewportResize() {

		if (!window?.visualViewport) return;

		if (lastHeight === 0) {
			lastHeight = layout.height
		}
		turnedPortrait = -portraitHeight + landscapeHeight

		const currentJump = layout.height - lastHeight
		console.log("current jump", currentJump)

		if (lastJump !== turnedPortrait && currentJump > 150 && (!lastJump || lastJump < -150)) layout.virtualKeyboard = true
		if (layout.portrait && lastJump > 150 && currentJump < -150) layout.virtualKeyboard = false
		lastJump = currentJump
		lastHeight = layout.height

	}

	let lastActiveElement:HTMLElement|undefined = $state()
	function handleOrientation(_e: Event) {
		layout.portrait = window.matchMedia("(orientation: portrait)").matches
		if (layout.portrait) {
			portraitHeight = layout.height
			lastActiveElement?.focus()
		}
		if (!layout.portrait) {
			
			//blur acive element to collapse virtual keyboard
			if (document.activeElement !== document.body) lastActiveElement = document.activeElement as HTMLElement
			lastActiveElement?.blur()
			layout.virtualKeyboard = false
			
			landscapeHeight = layout.height
		}
	}

	let cleanup = () => {}; // Default no-op function

	onMount(() => {
	if (browser && window.visualViewport) {
		window.addEventListener("deviceorientation", handleOrientation, true);
		window.visualViewport.addEventListener('resize', handleViewportResize);
		// Save the cleanup function
		cleanup = () => {
		window.visualViewport?.removeEventListener('resize', handleViewportResize);
		window.removeEventListener("deviceorientation", handleOrientation);
	};
	}
	});

	onDestroy(() => {
		cleanup();
	});
</script>


<div class="app-layout" 
    bind:clientWidth={layout.width}
    bind:clientHeight={layout.height}
>
    {@render children?.()}
</div>

<style>
    
	.app-layout {
		position: absolute;
		height: 100%;
		width: 100%;
		max-width: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>