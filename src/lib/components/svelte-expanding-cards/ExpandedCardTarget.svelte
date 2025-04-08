<script lang="ts">
	import { onMount } from "svelte";
	import { getTargetContext, setTargetContext, type TargetContainer } from "./ExpandingCards.svelte";

    let { children = undefined, classes = "", style = "", contextKey = undefined} = $props()

    let thisTarget:HTMLElement | undefined = $state()
    $effect(() => {container.node = thisTarget})

    let container = $state<TargetContainer>(contextKey ? getTargetContext(contextKey) : getTargetContext() || {})

    function bindTarget() {
        if (Object.keys(container).length === 0 || JSON.stringify(container) === "{}") return
        contextKey ? setTargetContext(container, contextKey) : setTargetContext(container)     
    }
    
    function getPositionDetails() {
        if (!thisTarget) return
        const containerDomRect:DOMRect | undefined = thisTarget.getBoundingClientRect() ?? undefined
        container.top = containerDomRect?.top
        container.left = containerDomRect?.left
    }
    
    onMount(() => {
        getPositionDetails()
        container.refresh = getPositionDetails
    })
    

</script>
<svelte:window onresize={getPositionDetails}></svelte:window>

<section
    class="expanded-target {classes} {contextKey}"
    style={style}
    bind:clientHeight={container.height}   
    bind:clientWidth={container.width}
    bind:this={thisTarget} 
> 
    {#if children}
        {@render children()}
    {/if}
</section>

<style>
    .expanded-target, :global(.expanded-target > *) {
        box-sizing: border-box;
    }

    section {
        height: 100%;
        width: 100%;
        flex: 1;
    }
    
</style>