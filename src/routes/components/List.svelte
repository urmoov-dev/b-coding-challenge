<script lang="ts">
	import { page } from "$app/state";
	import ExpandedCardTarget from "$lib/components/svelte-expanding-cards/ExpandedCardTarget.svelte";
	import ExpandingCard from "$lib/components/svelte-expanding-cards/ExpandingCard.svelte";
	import ExpandingCardsContext from "$lib/components/svelte-expanding-cards/ExpandingCardsContext.svelte";
	import { setPageState, type PageStateKey } from "$lib/functions/forPageState";
	import type { LightningNodes } from "$lib/types";
	import { faArrowsRotate, faCaretDown, faLocationPin, faXmark } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import ListDetails from "./ListDetails.svelte";
	import { onMount, tick } from "svelte";
	import { getLocale } from "$lib/paraglide/runtime";
	import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
	import { getLayoutState } from "$lib/components/layout-state.svelte";
	import { fade, slide } from "svelte/transition";
	import { quartOut } from "svelte/easing";

    const layout = getLayoutState()

    let {headers, lightningNodes, sortBy = $bindable(), formatValue} = $props()
    let selectedHeader = $derived(headers.find((obj: typeof headers[0]) => {return obj.key === sortBy}))
    let showSortingOptions =$state(false)

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
    
    let locale = getLocale()
    const parsedLocale = $derived(locale === "pt-br" ? "pt-BR" 
            : locale === "zh-cn" ? "zh-CN" : locale)

    function windowClick(e:Event) {
        const target = e.target as HTMLElement
        if (target.closest("button")) return
        if (showSortingOptions && !target.closest(".sorting-options")) showSortingOptions = false
    }

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

	let mounted = $state(false)
    //open first node when closing a different node
    $effect(() => {
        if (mounted === false || layout.width <= 1000 || layout.portrait) return 
        for (const key in (page.state?.["nodes" as PageStateKey] as [])) {
            if (Object.prototype.hasOwnProperty.call((page.state?.["nodes" as PageStateKey] as []), key)) {
                const element = (page.state?.["nodes" as PageStateKey] as [])[key] as {open: boolean};
                if (element.open === true) return
            }
        }
        setPageState(true, `nodes.${lightningNodes[0].publicKey}.open`, 'push')
    })
    
    onMount(async() => {
        await new Promise(resolve => {return setTimeout(resolve, 150)})
        if (window.innerWidth > 1000 ) await setPageState(true, `nodes.${lightningNodes[0].publicKey}.open`, 'push')
    })

    let dropdownButton = $state<HTMLElement>()
    let headerOptionsPosition = $state<DOMRect>()
    function updateDropwdownPosition() {
        headerOptionsPosition = dropdownButton?.getBoundingClientRect()
    }
    let dropdownTop = $derived(layout.portrait || layout.width <= 1000 ? headerOptionsPosition?.bottom : headerOptionsPosition?.top)
    let dropdownLeft = $derived(layout.portrait || layout.width <= 1000 ? headerOptionsPosition?.left : headerOptionsPosition?.right)

</script>

<div class="list-container flex h-full w-full absolute top-0 left-0" class:mobile={layout.portrait || layout.width <= 1000} transition:fade>
<ExpandingCardsContext {contextKey}>
    <div class="side-list" bind:clientWidth={listWidth}>
        <div class="list-header flex justify-between items-baseline bg-[var(--color-bg-2)] text-2xl pl-2">
            <span class="mr-auto font-medium">Alias</span>
            <span class="mx-auto">Sort:</span>
            <button class="cursor-pointer rounded-lg relative p-2 flex items-center gap-2"
                bind:this={dropdownButton}
                onclick={() => {
                    updateDropwdownPosition()
                    showSortingOptions = !showSortingOptions}}
            >
                {selectedHeader.label}
                <Fa icon={faCaretDown}></Fa>
            </button>
            {#if showSortingOptions}
                <div class="sorting-options py-0.5 rounded-lg text-xl cursor-pointer z-20"
                    style="top: {dropdownTop}px; left: {dropdownLeft}px;"
                    transition:slide={{axis: "y", duration: 300, easing: quartOut}}
                >
                    {#each headers as header}
                        <button class="header-option px-2 py-0.5" onclick={() => {
                            sortBy = header.key;
                            showSortingOptions = false
                        }}>
                            {#if header.sortable}
                            {header.label}
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="sorted-list sticksTo relative bg-[var(--color-bg-1)]  overflow-y-auto flex flex-col items-stretch">
            {#each lightningNodes as LightningNodes as node, i}
            {@const city = node.city?.[parsedLocale] || node.city?.en || ""}
            {@const country = node.country?.[parsedLocale] || node.country?.en || ""}
                <div class="node-summary flex justify-between sticks" data-key="{node.publicKey}"
                    data-alias="{node.alias}"
                    class:open={(page.state?.["nodes" as PageStateKey]?.[node.publicKey] as {open:boolean})?.open}
                >
                    <ExpandingCard classes="w-full" customMethod={closeOtherNodes(node.publicKey)}
                        buttonStyle="padding-block: calc(var(--spacing)* 1); padding-inline: calc(var(--spacing)* 3); width: 100%;" {contextKey} 
                        toggleProp={toggleNodes[node.publicKey]}
                        shallowRouting={[
                            {key: `nodes.${node.publicKey}.open`, value: true}
                        ]}
                    >
                        {#snippet summary()} 
                            <button class="listItem w-full h-full flex flex-col gap-1 justify-between "
                                class:separator={i !== 0}
                            >
                                <div class="flex w-full justify-between gap-1">
                                    <span  class="listItem node-alias flex items-center gap-1 min-w-15">
                                        <span class="font-normal">{i+1}.</span>
                                        <span>{node.alias}</span>
                                    </span>
                                    <span class="listItem flex items-center gap-1 min-w-0">
                                        <Fa icon={faBitcoin} color="#f7931a"/> 
                                        <span>{formatValue(sortBy !== "alias" ? "capacity" : sortBy, node)}</span>
                                    </span>
                                </div>
                                <div class="sub-list flex w-full justify-between gap-2">
                                    <span class="flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Fa icon={faLocationPin} color="var(--color-theme-2)"/>
                                        <span>{city ? `${city}, ` : ""}{country}{!city && !country ? "Worldwide" : ""}</span>
                                    </span>
                                    <span class="flex items-center gap-1 flex-nowrap whitespace-nowrap">
                                        <Fa icon={faArrowsRotate} color="var(--color-theme-1)"/>
                                        <span>{formatValue('shortTime', node)}</span>
                                    </span>
                                </div>
                            </button>
                        {/snippet}
                        {#snippet details()}
                            <ListDetails {node} {formatValue}></ListDetails>
                        {/snippet}
                        {#snippet closeDetailsButton()}
                            {#if i >-1}
                                <button onclick={() => {setPageState(false, `nodes.${node.publicKey}.open`, "replace")}}
                                    class="absolute top-2 right-2" 
                                >
                                    <Fa icon={faXmark} color={"var(--color-text)"}/>
                                </button>
                            {/if}
                        {/snippet}
                    </ExpandingCard>
                </div>
            {/each}
        </div>
    </div>
    <div class="details-container">
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
        width: clamp(min(65rem, 98%), calc(50% + 25rem), 1920px);
        height: 100%;
        /* min-width: calc(20ch + 40rem); */
        border-radius: 1rem;
        display: flex;
        align-items: stretch;
        overflow: hidden;
    }

    .details-container {
        pointer-events: none;
        position: relative;
        flex: 1;
        min-width: 40rem;
    }

    .side-list {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        min-width: 20ch;
    }

    .sorting-options {
        display: flex;
        flex-direction: column;
        background-color: var(--color-bg-0);
        position: fixed;
        overflow: hidden;
    }

    .node-summary:not(.open):hover, .list-header > button:hover{
        cursor: pointer;
        background-color: hsl(0 0% 0% / 35%);
        transition: background-color 0.1s ease-out;
    }

    .open, .node-summary:has(:global(.inTransition)), 
    .node-summary > :global(.expanding-summaryButton:has(+ .inTransition)) {
        background-color: var(--color-theme-1);
        color: var(--color-bg-0);
        font-weight: 500;
        position: sticky;
        top: 0;
        bottom: 0;
        z-index: 10;
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

    .header-option:hover {
        background-color: var(--color-bg-2);
        transition: background-color 0.1s ease-out;
    }

    .list-header > * {
        font-size: 1.2rem;
    }

    .node-alias :global(*):hover {
        color: #f7931a;
    }

    span.listItem, span.listItem :global(font) {
        /* align-self: center; */
        flex-wrap: nowrap;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 1.3rem;
    }
    span.listItem > :global(svg) {
        vertical-align: bottom;
        height: 1rem;
        font-size: 1rem;
    }
    .sub-list:first-child, .sub-list:first-child :global(font) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .separator {
        border-top: solid 1px var(--color-text-2)
    }

    .sorting-options {
        left: 0;
        top: 0; 
    }

    @media (orientation: portrait) and (max-width: 1000px) {
        
        .list-container {
            position: relative;
            width: 98%;
        }

        .side-list, .details-container {
            position: absolute;
            width: 100%;
            height: 100%;
            min-width: 90%;
        }
        .list-header, .list-header > * {
            font-size: 1.5rem;
        }

        span.listItem, span.listItem :global(font){
            font-size: 1.5rem;
        }
        .sub-list > span, .sub-list > span :global(font){
            font-weight: 500;
            font-size: 0.9rem
        }

        .node-alias {
            font-weight:600
        }

        .sorting-options {
            left:auto;
            right: 5px;
            top: 3rem;
        }
    }
</style>