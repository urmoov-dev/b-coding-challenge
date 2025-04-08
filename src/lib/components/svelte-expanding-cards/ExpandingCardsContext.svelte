<script lang="ts">
	import { setTargetContext, type TargetContainer } from "./ExpandingCards.svelte";

    let { children, contextKey = undefined} = $props()

    let container : TargetContainer = $state({})
    contextKey ? setTargetContext(container, contextKey) : setTargetContext(container)     

</script>

{@render children?.()}