<script lang="ts">
	import { onMount, setContext, tick, type Snippet } from "svelte";
	import { type BlurParams, type CrossfadeParams, type DrawParams, type EasingFunction, type FlyParams, type ScaleParams, type SlideParams, type TransitionConfig } from "svelte/transition";
	import { getTargetContext, type TargetContainer } from "./ExpandingCards.svelte";
	import { circOut } from "svelte/easing";
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { setToValue } from "$lib/functions/forObjects";

    type AllTransitionParams = TransitionConfig | BlurParams | FlyParams | SlideParams | ScaleParams | DrawParams | CrossfadeParams

    type $$Props = {
        jsStyle?:  {
            height?: string,
            outlineRadius?: string,
        },
        buttonStyle?: string,
        detailsStyle?: string,
        summary?: Snippet,
        details?: Snippet,
        closeDetailsButton?: Snippet,
        classes?: string,
        transitionConfig?: AllTransitionParams
        toggleProp?: boolean,
        contextKey?: string,
        shallowRouting?: {
            key?: string,
            value?: boolean | string | number | null | any[]
        }[],
        fixToBottom?: boolean,
        customMethod?: void | (() => void),
        detailsIn?: (arg0: HTMLElement, arg1: TransitionConfig) => {},
        detailsInConfig?: AllTransitionParams,        
        detailsOut?: (arg0: HTMLElement, arg1: TransitionConfig) => {},
        detailsOutConfig?: AllTransitionParams,
        summaryIn?: (arg0: HTMLElement, arg1: TransitionConfig) => {},
        summaryInConfig?: AllTransitionParams,        
        summaryOut?: (arg0: HTMLElement, arg1: TransitionConfig) => {},
        summaryOutConfig?: AllTransitionParams,
    }

    let { 
        jsStyle = {},
        buttonStyle = "",
        detailsStyle = "",
        summary,
        details,
        closeDetailsButton,
        classes = "",
        transitionConfig = {
            delay: 100,
            duration: 500,
            easing: circOut,
        },
        toggleProp= $bindable(undefined),
        contextKey = undefined,
        shallowRouting = [],
        fixToBottom = false,
        customMethod = () => {},
        detailsIn = undefined,
        detailsInConfig = undefined,
        detailsOut = undefined,
        detailsOutConfig = undefined,
        summaryIn = undefined,
        summaryInConfig = undefined,
        summaryOut = undefined,
        summaryOutConfig = undefined,
    } : $$Props = $props()       

    let expandingCard = $state({showDetails: toggleProp || false})
    let {showDetails} = $derived(expandingCard)

    // // svelte-ignore state_referenced_locally
        setContext(`expandingCard${contextKey}`, expandingCard)

    const {
        height,
    } = $derived(jsStyle)

    const containerContext = contextKey ? getTargetContext(contextKey) : getTargetContext()
    const ancestorContext = $state({})

    const {height: containerHeight = 0, width: containerWidth = 0, top: containerTop = 0, left: containerLeft = 0} = $derived(containerContext)


    async function toggleDetails(e:MouseEvent, toggleTo = !showDetails) {
        e.stopPropagation()

        inTransition = true
        thisCardDetails?.querySelector(":scope > .summary")?.classList.add("border");

        customMethod()

        //set behavior if using shallowRouting
        if (shallowRouting.length > 0) {
            
            shallowRouting.forEach(state => {

                //clone page.state and setToValue
                const newState = {...page.state}
                setToValue(newState, state.value, state.key as string)

                
                pushState('', newState)  
                
            })
            
            return
        }
        
        if (toggleProp !== undefined) return toggleProp = toggleTo
        expandingCard.showDetails = toggleTo
    }

    async function toggleWithProp(toggleTo:boolean) {
        inTransition = true

        await tick()

        expandingCard.showDetails = toggleTo
    }

    $effect(() => {if (toggleProp !== undefined && showDetails !== toggleProp) toggleWithProp(toggleProp)})

    //transition of the details snippet
    function transitionDetails(node:HTMLElement, transitionConfig: AllTransitionParams) {
        containerContext.refresh?.()
        getSummaryPositionDetails()

        node.classList.add("inTransition")
        node.classList.add("outline")

        thisCardDetails?.querySelector(":scope > .opacity-overlay")?.classList.add("frosted-glass");
        const transformDiff = {
            width: 100-(100*cardWidth)/containerWidth,
            height: 100-(100*cardHeight)/containerHeight,
            top: summaryButton.top! - containerTop,
            left : summaryButton.left! - containerLeft 
        }

        const allOverlays = thisCardDetails!.querySelectorAll(".opacity-overlay")     
            allOverlays.forEach(overlay => {
                overlay?.classList.remove("frosted-glass");
            })

        return {
            duration: transitionConfig?.duration,
            delay: transitionConfig?.delay,
            easing: transitionConfig?.easing,
            css: (t:number, u:number) => `opacity: ${t*10}; transform: translate(${transformDiff.left*u}px, ${transformDiff.top*u}px) scale(${(100-u*transformDiff.width)/100}, ${(100-u*transformDiff.height)/100});`
        }
    }

    //transitions of the summary snippet
    function revealSummary(e:Event) {        
        (e.target as HTMLElement)?.classList.add("disabled")
        thisCardProxy?.classList.remove("transparent")
        thisCardProxy!.style.zIndex = ""
    }

    function transitionSummary(node:HTMLElement, transitionConfig: AllTransitionParams) {
        containerContext.refresh?.()
        getSummaryPositionDetails()
        
        node?.querySelector(".opacity-overlay")?.classList.add("frosted-glass")
        node.style.zIndex = "50"
        if (node?.classList.contains("disabled")) node?.classList.remove("disabled")
        if (!thisCardProxy?.classList.contains("transparent")) thisCardProxy?.classList.add("transparent")
        const transformDiff = {
            width: 100-(100*containerWidth )/cardWidth,
            height: 100-(100*containerHeight)/cardHeight,
            top: containerTop - cardTop,
            left : containerLeft - cardLeft!
        }

        return {
            duration: transitionConfig?.duration,
            delay: transitionConfig?.delay,
            easing: transitionConfig?.easing,
            css: (t:number, u:number) => `opacity: ${t*10};transform: translate(${transformDiff.left*u}px, ${transformDiff.top*u}px) scale(${(100-u*transformDiff.width)/100}, ${(100-u*transformDiff.height)/100});`
        }
    }


    let thisSummaryElement:HTMLElement | undefined = $state()
    let thisCardProxy:HTMLElement | undefined = $state()
    let thisCardDetails:HTMLElement | undefined = $state()
    
    $effect(() => {summaryButton.node = thisSummaryElement})

    let summaryButton : TargetContainer = $state({})
    $effect(() => {
        if (summaryButton.top && (summaryButton.height || summaryButton.width)) {
            getSummaryPositionDetails();
        }
    }) 

    const {top: cardTop = 0, left: cardLeft = 0, height: cardHeight = 0, width: cardWidth = 0} = $derived(summaryButton)
    
    function getSummaryPositionDetails() {
        if (!thisSummaryElement) return
        const cardDomRect:DOMRect | undefined = thisSummaryElement.getBoundingClientRect() ?? undefined
        summaryButton.top = cardDomRect?.top
        summaryButton.left = cardDomRect?.left
        summaryButton.width = cardDomRect?.width
        summaryButton.height = cardDomRect?.height
    }
    
    let inTransition = $state(false);
    let offset = $derived.by(() => {
        let top = 0
        let left = 0

        const ancestorDetails= thisCardDetails?.closest(".details")

        return {
            top: top,
            left: left
        }
    })

    onMount(async () => {
        containerContext.refresh?.()
        getSummaryPositionDetails()
    })

    function processDetailsOut(node:HTMLElement, config: AllTransitionParams) {
        if (!detailsOutConfig) return transitionDetails(node, config)
        if (detailsOut) {
            containerContext.refresh?.()
            getSummaryPositionDetails()

            node.classList.add("inTransition")
            node.classList.add("outline")

            thisCardDetails?.querySelector(":scope > .opacity-overlay")?.classList.add("frosted-glass");
            return detailsOut(node, detailsOutConfig as TransitionConfig)
        }
        return transitionDetails(node, config)
    }

    function processDetailsIn(node:HTMLElement, config: AllTransitionParams) {
        if (!detailsInConfig) return transitionDetails(node, config)
        if (detailsIn) {
            containerContext.refresh?.()
            getSummaryPositionDetails()

            node.classList.add("inTransition")
            node.classList.add("outline")

            thisCardDetails?.querySelector(":scope > .opacity-overlay")?.classList.add("frosted-glass");
            
            return detailsIn(node, detailsInConfig as TransitionConfig)
        }
        return transitionDetails(node, config)
    }
    
    function processSummaryIn(node:HTMLElement, config: AllTransitionParams) {
        if (!summaryInConfig) return transitionSummary(node, config)
        if (summaryIn) {
            node?.querySelector(".opacity-overlay")?.classList.add("frosted-glass")
            node.style.zIndex = "50"
            if (node?.classList.contains("disabled")) node?.classList.remove("disabled")
            if (!thisCardProxy?.classList.contains("transparent")) thisCardProxy?.classList.add("transparent")
            
            return summaryIn(node, summaryInConfig as TransitionConfig)
        }
        return transitionSummary(node, config)
    }
    
    function processSummaryOut(node:HTMLElement, config: AllTransitionParams) {
        if (!summaryOutConfig) return transitionSummary(node, config)
        if (summaryOut) {
            node?.querySelector(".opacity-overlay")?.classList.add("frosted-glass")
            node.style.zIndex = "50"
            if (node?.classList.contains("disabled")) node?.classList.remove("disabled")
            if (!thisCardProxy?.classList.contains("transparent")) thisCardProxy?.classList.add("transparent")
            
            return summaryOut(node, summaryOutConfig as TransitionConfig)
        }
        return transitionSummary(node, config)
    }
    
</script>



<button class="button expanding-summaryButton {contextKey} {classes}"
    style="height: {height ?? "auto"}; --blurTime: {transitionConfig.delay!/500 || 0.25}s;"
    bind:this={thisSummaryElement}
    onclick={toggleDetails}
>
    <div bind:this={thisCardProxy} class="proxy" style={buttonStyle}>{@render summary?.()}</div>
    {#if !showDetails}
        <div class="summary disabled absolute" style={buttonStyle}
            in:processSummaryIn={transitionConfig}
            out:processSummaryOut={transitionConfig}
            onintroend={revealSummary}
        >
            {@render summary?.()}
            <div class="opacity-overlay"></div>
        </div>
    {/if}
</button>

{#if showDetails}

    <div  class="details {contextKey} " 
        bind:this={thisCardDetails}
        style=" --blurTime: {transitionConfig.delay!/500 || 0.25}s;
                top: {containerTop}px;
                left: {containerLeft}px;
                width: {containerWidth}px;
                height: {containerHeight}px;
                {detailsStyle}"
        in:processDetailsIn={transitionConfig}
        out:processDetailsOut={transitionConfig}
        onintroend={(e) => {
            containerContext.inTransition
            const node = e.target as HTMLElement
            const allOverlays = thisCardDetails!.querySelectorAll(".opacity-overlay")     
            allOverlays.forEach(overlay => {
                overlay?.classList.remove("frosted-glass");
            });
            thisCardDetails!.classList.remove("outline")
            thisCardDetails!.classList.remove("inTransition")
            inTransition = false
            containerContext.refresh?.()
            getSummaryPositionDetails()
        }}
        onoutroend={(e) => {
            containerContext.inTransition
            thisSummaryElement?.querySelector(".outline")?.classList.remove("outline")
        }}
    >

        {@render details?.()}
        <div class="opacity-overlay"></div>
        
        {#if closeDetailsButton}
            {@render closeDetailsButton()}
        {:else}
            <button class="close-details" onclick={toggleDetails}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1rem" width="1rem" viewBox="0 0 384 512">
                    <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
        {/if}

    </div>
    
{/if}

<style>

    svg {
        fill: var(--color-text)
    }
    .button {
        position: relative;
        height: 100%;
        transition: outline var(--blurTime) ease-out;
    }
    .button > :global(.transparent) {
        opacity: 0;
    }

    .proxy, .summary {
        overflow: hidden;
        border-radius: 1vh;
        height: 100%;
    }

    .summary {
        transform-origin: top left;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: outline var(--blurTime) ease-out;
    }

    .disabled.summary {
        opacity: 0;
        pointer-events: none;
    }

    .summaryButton{
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        visibility: visible;
    }
    
    .summaryWrapper {
        display: inherit;
        width: 100%;
    }

    .details {
        position: fixed;
        z-index: 50;
        transform-origin: top left;
        border-radius: 1vh;
        outline: 0px solid var(--color-bg-2);
        overflow: hidden;
        background-color: var(--color-bg-2);
        transition: outline var(--blurTime) ease-out, opacity 0.1s 0.1s;
    }
    
    .detailsTransitioner {
        position: sticky;
        z-index: 50;
        transform-origin: top left;
        border-radius: 1vh;
        overflow: hidden;
        outline: 0px solid var(--color-bg-2);
        pointer-events: none;
        opacity: 1;
        transition: opacity 1s ease-out;
    }

    .details > :global(*:not(button)), .transitionedDetailsWrapper > :global(*) {
        height: 100%;
        width: 100%;
    }

    .opacity-overlay {
        position:absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
        transition: backdrop-filter var(--blurTime) ease-out;
    }

    .frosted-glass {
        backdrop-filter: blur(3px);
    }

    .close-details {
        width: auto !important; 
        height: auto !important; 
        position: absolute;
        top: 2vh;
        right: 2vh;
    }
    
    .invisible {
        opacity: 0;
    }
    .hidden {
        visibility: hidden;
    }

    .visible {
        visibility: visible;
    }

    .outline {
        outline: 2px solid var(--color-theme-1)
    }
    .border {
        border: 2px solid var(--color-theme-1)
    }

    :global(.inTransition .details) {
        outline: 2px solid var(--color-theme-1);
    }

    :global(.inTransition .summary) {
        opacity: 0;
    }
    :global(.inTransition .button) {
        opacity: 1;
    }
    
</style>

{#if fixToBottom}
<style>

    :global(.inTransition .details) {
        position: absolute !important;
        top: auto !important;
        bottom: 0px !important;
        left: 0px !important;
    }

</style>
{/if}