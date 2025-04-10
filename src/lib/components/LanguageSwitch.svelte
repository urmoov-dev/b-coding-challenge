<script lang="ts">
	import { getLocale, setLocale } from "$lib/paraglide/runtime";
	import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { quartOut } from "svelte/easing";
	import { slide } from "svelte/transition";
	import { getLayoutState } from "./layout-state.svelte";
    import * as flagSVG from 'country-flag-icons/string/3x2'

    const locales = [
        {
            key: "en",
            code: "US"
        },
        {
            key: "de",
            code: "DK"
        },
        {
            key: "es",
            code: "ES"
        },
        {
            key: "fr",
            code: "FR"
        },
        {
            key: "ja",
            code: "JP"
        },
        {
            key: "pt-br",
            code: "BR"
        },
        {
            key: "ru",
            code: "RU"
        },
        {
            key: "zh-cn",
            code: "CN"
        }
    ]

    let select = $state(getLocale())
    let showLanguageOptions = $state(false)
    let selectedLocale = $derived(locales.find((obj: typeof locales[0]) => {return obj.key === select}))

    $effect(() => {
        setLocale(select)
    })

    let dropdownButton = $state<HTMLElement>()
    let headerOptionsPosition = $state<DOMRect>()
    function updateDropwdownPosition() {
        headerOptionsPosition = dropdownButton?.getBoundingClientRect()
    }

    const layout = getLayoutState()
    let dropdownTop = $derived(layout.portrait || layout.width <= 1000 ? headerOptionsPosition?.bottom : headerOptionsPosition?.bottom)
    let dropdownLeft = $derived(layout.portrait || layout.width <= 1000 ? headerOptionsPosition?.left : headerOptionsPosition?.left)

    function localeSVG(code:string) {
        //@ts-ignore
        return flagSVG[code]
    }
</script>


<button class="i18n-dropdown cursor-pointer rounded-lg relative p-2 flex items-center gap-2"
    bind:this={dropdownButton}
    onclick={() => {
        updateDropwdownPosition()
        showLanguageOptions = !showLanguageOptions}}
>
    {@html localeSVG(selectedLocale?.code || "us")}
</button>
{#if showLanguageOptions}
    <div class="i18n-dropdown sorting-options py-0.5 rounded-lg text-xl cursor-pointer z-20"
        style="top: {dropdownTop}px; left: {dropdownLeft}px;"
        transition:slide={{axis: "y", duration: 300, easing: quartOut}}
    >
        {#each locales as locale}
        {#if locale !== selectedLocale}
            <button class="locale-option px-2 py-0.5" onclick={() => {
                select = locale.key as typeof select
                showLanguageOptions = false
            }}>
                <span>{@html localeSVG(locale.code)}</span>
            </button>
        {/if}
        {/each}
    </div>
{/if}

<style>
    .sorting-options {
        display: flex;
        flex-direction: column;
        background-color: var(--color-bg-0);
        position: fixed;
        overflow: hidden;
    }
    button {
        height: 2rem;
        width: 3rem;
    }
</style>