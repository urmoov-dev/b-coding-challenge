<script lang="ts">
	import { bounceOut } from "svelte/easing";
	import { fly } from "svelte/transition";


</script>

<div in:fly={{y:1000, duration: 1000, easing:bounceOut}}  class="w-full h-full flex items-center justify-center">
    <span class="font-bold">404</span>
</div>

<style>
    div {
        overflow: hidden;
        cursor: not-allowed;
    }
    span {
        font-size: 80vh;
        opacity:0.5;
        transform: translateY(30%);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    }

    span:hover {
        transform: translateY(5%)
    }
</style>