<script lang="ts">
	import { GoogleSpin } from "svelte-loading-spinners";
	import { bounceOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
</script>

<div in:fly={{y:1000, duration: 1000, easing:bounceOut}}  
    class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    out:fade={{duration: 500}}
>
    <GoogleSpin size="min(20vh,20vw)"></GoogleSpin>
</div>

<style>
    div {
        overflow: hidden;
        cursor: progress;
    }
</style>