<script lang="ts">
	import { page } from "$app/state";
	import ExpandedCardTarget from "$lib/components/svelte-expanding-cards/ExpandedCardTarget.svelte";
	import ExpandingCard from "$lib/components/svelte-expanding-cards/ExpandingCard.svelte";
	import ExpandingCardsContext from "$lib/components/svelte-expanding-cards/ExpandingCardsContext.svelte";
	import { setPageState, type PageStateKey } from "$lib/functions/forPageState";
	import type { LightningState } from "$lib/lightning.svelte";
	import type { LightningNodes, SortableLightningProperties } from "$lib/types";
	import { faXmark } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import ListDetails from "./ListDetails.svelte";
	import { fade, fly, slide } from "svelte/transition";
	import { quartOut } from "svelte/easing";

    let {headers, lightningNodes, sortBy = $bindable(), formatValue} = $props()
    let selectedHeader = $derived(headers.find((obj: typeof headers[0]) => {return obj.key === sortBy}))
    let showSortingOptions =$state(true)
    $effect(() => {
        console.log(headers.find((o: typeof headers[0]) => {return o.key === sortBy}))
    })

    function windowClick(e:Event) {
        const target = e.target as HTMLElement
        if (target.closest("button")) return
        if (showSortingOptions && !target.closest(".sorting-options")) showSortingOptions = false
        console.log(target, "windowClick")
    }

    let listWidth = $state<number>()
    let contextKey = "list"
    let toggleNodes = $derived.by(() => {
        const nodes: {[key:string]: boolean |any} = {}
        const nodePageState:{[key:string]: {open: boolean}} = page.state?.["nodes" as PageStateKey]
        lightningNodes?.forEach((node:LightningNodes[0]) => {
            const nodeKey = node.publicKey
            nodes[nodeKey] = nodePageState?.[nodeKey]?.open === true
        })
        return nodes
    })

    function closeOtherNodes(currentKey:string) {
        const nodes = page.state?.["nodes" as PageStateKey] as {[key:string]: {open:boolean}}[]
        for (const key in nodes) {
            if (key === currentKey) continue 
            if (Object.prototype.hasOwnProperty.call(nodes, key)) {
                let element = nodes[key];
                //@ts-ignore
                element.open = false
            }
        }

        
    }
    

</script>

<div class="list-container flex h-full w-full">
<ExpandingCardsContext {contextKey}>
    <div class="side-list" bind:clientWidth={listWidth}>
        <div class="list-header flex justify-between items-baseline bg-[var(--color-bg-2)] text-2xl pl-2">
            <span>Alias:</span>
            <span class="ml-auto text-xl mr-1">Sort:</span>
            <button class="text-xl cursor-pointer rounded-lg relative"
                onclick={() => showSortingOptions = !showSortingOptions}
            >
                {selectedHeader.label}
            </button>
            {#if showSortingOptions}
                <div class="sorting-options py-0.5 rounded-lg text-xl cursor-pointer left-0">
                    {#each headers as header}
                        <button class="px-2 py-0.5" onclick={() => {
                            sortBy = header.key;
                            showSortingOptions = false
                        }}>
                            {header.label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="sorted-list bg-[var(--color-bg-1)]  overflow-y-auto flex flex-col items-stretch">
            {#each lightningNodes as LightningNodes as node}
                <div class="node-summary flex justify-between " data-key="{node.publicKey}"
                    data-alias="{node.alias}"
                    class:open={(page.state?.["nodes" as PageStateKey]?.[node.publicKey] as {open:boolean})?.open}
                >
                    <ExpandingCard classes="w-full" customMethod={closeOtherNodes(node.publicKey)}
                        buttonStyle="padding-block: calc(var(--spacing)* 1); padding-inline: calc(var(--spacing)* 3); width: 100%;" {contextKey} 
                        toggleProp={toggleNodes[node.publicKey]}
                        shallowRouting={[
                            {key: `nodes.${node.publicKey}.open`, value: true}
                        ]}
                        detailsOut={fly} detailsOutConfig={{duration: 1000, easing: quartOut, x: "100%"}} 
                        summaryIn={fade} summaryInConfig={{duration: 300, easing: quartOut}} 
                    >
                        {#snippet summary()}
                            <button class="w-full h-full flex justify-between">
                                <span>{node.alias}</span>
                                <span class="sorted-by ml-5">{formatValue(sortBy, node)}</span>
                            </button>
                        {/snippet}
                        {#snippet details()}
                            <ListDetails {node}></ListDetails>>
                        {/snippet}
                        {#snippet closeDetailsButton()}
                            <button onclick={() => {setPageState(false, `nodes.${node.publicKey}.open`, "replace")}}
                                class="absolute top-2 right-2" 
                            >
                                <Fa icon={faXmark} color={"var(--color-text)"}/>
                            </button>
                        {/snippet}
                    </ExpandingCard>
                </div>
            {/each}
        </div>
    </div>
    <div class="details flex-1">
        <ExpandedCardTarget {contextKey}>
        </ExpandedCardTarget>
    </div>
</ExpandingCardsContext>
</div>

<svelte:window onclick={windowClick}></svelte:window>

<style>
    .list-container {
        align-self: stretch;
        margin-inline: auto;
        color: var(--color-text-0);
        background-color: var(--color-bg-2);
        max-width: 70%;
        height: 85vh;
        max-width: white;
        border-radius: 1rem;
        display: flex;
        align-items: stretch;
        overflow: hidden;
    }

    .side-list {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }

    .sorting-options {
        display: flex;
        flex-direction: column;
        background-color: var(--color-bg-2);
        position: absolute;
        overflow: hidden;
    }

    .node-summary:not(.open):hover, .list-header > button:hover{
        cursor: pointer;
        background-color: hsl(0 0% 0% / 35%);
        transition: background-color 0.1s ease-out;
    }

    .open {
        background-color: var(--color-theme-1);
        color: var(--color-bg-0);
        font-weight: 500;
    } 

    button {
        cursor: pointer
    }


    .node-summary :global(.proxy) {
        transition: opacity 0.5s 1s ease-in;
    }

    .open :global(.proxy){
        opacity: 1 !important;
        transition: opacity 2s ease-in;
    }
    
    .open :global(.proxy *) {
        color: var(--color-bg-1) !important;
    }

</style>