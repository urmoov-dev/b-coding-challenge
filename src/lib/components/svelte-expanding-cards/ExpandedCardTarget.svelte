<script lang="ts">
	import { onMount } from "svelte";
	import { getTargetContext, setTargetContext, type TargetContainer } from "./ExpandingCards.svelte";

    let { children, classes = "", style = "", contextKey = undefined} = $props()

    let thisTarget:HTMLElement | undefined = $state()
    $effect(() => {container.node = thisTarget})

    let container : TargetContainer = $state({})
    contextKey ? setTargetContext(container, contextKey) : setTargetContext(container)     
    
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
    {@render children?.()}
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