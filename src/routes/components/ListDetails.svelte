<script lang="ts">
	import { getLayoutState } from "$lib/components/layout-state.svelte";
	import { getLocale } from "$lib/paraglide/runtime";
	import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
	import { faCopy, faFileExport } from "@fortawesome/free-solid-svg-icons";
	import Fa, { type IconSize } from "svelte-fa";

    const layout = getLayoutState()

    let { node = $bindable(), formatValue} = $props()

    let locale = getLocale()
    const parsedLocale = $derived(locale === "pt-br" ? "pt-BR" 
            : locale === "zh-cn" ? "zh-CN" : locale)

</script>

<div class="details-container flex flex-col justify-between items-center w-full">
    <!-- {JSON.stringify(node)} -->
     <div class="alias-container w-full wrap-break-word text-8xl text-center flex items-center gap-1">
        <h1 class="ml-auto">{node.alias}</h1>
        <div class="alias-actions mr-auto">
            <button onclick={() => navigator.clipboard.writeText(node.alias)}
                class="p-4"
            >
                <Fa icon={faFileExport} color="white"></Fa>
            </button>
            <button onclick={() => navigator.clipboard.writeText(node.alias)}
                class="p-4"
            >
                <Fa icon={faCopy} color="white"></Fa>
            </button>
        </div>
    </div>
    <div class="self-stretch">
        <h3 class="text-4xl text-center mb-2">Location:</h3>
        <div class="flex self-stretch justify-evenly locationInfo">
            <span>
                Country: {node.country?.[parsedLocale] || node.country?.en || "unknown"}
                <button onclick={() => navigator.clipboard.writeText(node.country?.[parsedLocale] || node.country?.en || "null")}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
            <span>
                City: {node.city?.[parsedLocale] || "unknown"}
                <button onclick={() => navigator.clipboard.writeText(node.city?.[parsedLocale] || "null")}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
            <span>
                ISO Code: {node.iso_code} 
                <button onclick={() => navigator.clipboard.writeText(node.iso_code)}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
        </div>
    </div>
    <div class="bitcoin-wrapper text-6xl flex items-center rounded-[10rem] pl-5 btc-wrapper">
        <span>{formatValue("capacity", node)}</span>
        <Fa icon={faBitcoin} color="#f7931a"></Fa>
    </div>
    <div class="public-key-container flex flex-col w-full">
        <h2 class="text-5xl text-center mb-2">Public Key:</h2>
        <div class="public-key-wrapper text-2xl flex items-center rounded-[10rem] pl-5">
            <span>{node.publicKey}</span>
            <button onclick={() => navigator.clipboard.writeText(node.publicKey)}
                class="p-5"
            >
                <Fa icon={faCopy} size="1.5x"></Fa>
            </button>
        </div>
    </div>
    <div class="self-stretch">
        <h3 class="text-4xl text-center mb-2">Details:</h3>
        <div class="flex self-stretch justify-center infrastructure">
            <span>
                Subdivision: {formatValue("subdivision", node) || "unknown"}
                <button onclick={() => navigator.clipboard.writeText(formatValue("subdivision", node) || "null")}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
            <span>
                Channels: {node.channels || "?"}
                <button onclick={() => navigator.clipboard.writeText(node.channels || "null")}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
            <span>
                Capacity: {node.capacity} SATS 
                <button onclick={() => navigator.clipboard.writeText(node.capacity)}
                    class:hide={!layout.portrait || layout.width > 1000}
                >
                    <Fa icon={faCopy}></Fa>
                </button>
            </span>
        </div>
    </div>
    <div class="times flex self-stretch justify-evenly">
       <span>First Seen @ {formatValue( "firstSeen", node)}</span>
       <span>Last updated @ {formatValue("updatedAt", node)}</span>
   </div>
    <div></div>
</div>

<style>

    .details-container {
        background-color: var(--color-bg-2);
        padding: min(8%, 40px);
        max-height: 65rem;
        min-height: 100%;
        height: auto !important;
    }

    span, .public-key-wrapper, .bitcoin-wrapper {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        max-width: 100%;
        outline: solid 2px transparent;
        transition: outline 0.2s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .public-key-container {
        gap: 2rem;
    }

    .public-key-wrapper:hover, .bitcoin-wrapper:hover, 
    div:not(.public-key-wrapper):not(.times) > span:hover,
    div:not(.bitcoin-wrapper):not(.times) > span:hover  {
        outline: solid 2px var(--color-theme-1);
    }
    .btc-wrapper:hover {
        outline: solid 2px #f7931a;
    }

    div:not(.public-key-wrapper) > span,
    div:not(.bitcoin-wrapper) > span {
        padding: 0.5rem;
        padding-left: 0.9rem;
        border-radius: 3rem;
    }


    button {
        border-radius: 50%;
        position: sticky;
        right: 0;
        transition: opacity 0.2s ease-out, background-color 0.2s ease-out;
    }

    div:not(.alias-container):not(.alias-actions):hover > button, span:hover > button, button:hover {
        background-color: var(--color-theme-1)
    }

    .hide {
        opacity: 0;
    }

    span:hover > .hide {
        opacity: 1;
    }

    .alias-container > div {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
    }

    .alias-container button {
        padding: 0.5rem;
    }

    .alias-container :global(svg) {
        font-size: 1rem;
    }
    
    .bitcoin-wrapper > span {
        font-size: 3rem !important;
        padding: none;
    }
    .bitcoin-wrapper > span:hover {
        outline: solid 2px transparent !important;
    }
    .bitcoin-wrapper :global(svg) {
        font-size: 4rem;
    }
    
    
    .infrastructure, .locationInfo {
            flex-direction: row;
    }
    div:not(.public-key-wrapper):not(.times) > span,
    div:not(.public-key-wrapper):not(.times) > span :global(font),
    div:not(.bitcoin-wrapper):not(.times) > span,
    div:not(.bitcoin-wrapper):not(.times) > span :global(font) {
        font-size: 0.9rem;
    }

        h1, h1 :global(font) {
            color: #f7931a !important;
            font-size: 4rem;
        }
    
        h2, h3, h2 :global(font), h3 :global(font) {
            color: var(--color-theme-1);    
        }
    
        h2, h2 :global(font) {
            font-size: 3rem;
        }
    
        h3, h3 :global(font) {
            font-size: 2.5rem;
        }


    @media (orientation: portrait) and (max-width: 1000px) {
        
        .details-container {
            font-size: 10px;
        }
        
        .public-key-wrapper {
            font-size: 2.5rem !important;
        }

        .public-key-wrapper > span {
            flex-shrink: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .alias-container {
            line-height: 3.4rem;
        }

        .infrastructure, .locationInfo {
            flex-direction: column;
            align-items: center;
        }

        .infrastructure:not(.public-key-wrapper):not(.times) > span,
        .infrastructure:not(.public-key-wrapper):not(.times) > span :global(font),
        .locationInfo:not(.public-key-wrapper):not(.times) > span,
        .locationInfo:not(.public-key-wrapper):not(.times) > span :global(font) {
            font-size: 0.9rem;
            padding: 0;
            padding-left:0.5rem;
        }

        .public-key-container {
            gap: 0.2rem;
        }

        .public-key-container :global(svg) {
            font-size: 1.5rem !important;
        }

        .public-key-container button:has(> :global(svg)) {
            padding: 0.7rem;
        }
    

        h1, h1 :global(font) {
            font-size: 3rem;
        }

        h2, h2 :global(font), h3, h3 :global(font) {
            color: var(--color-theme-1);    
        }
    
        h2, h2 :global(font) {
            font-size: 2.1rem;
        }

        h3, h3 :global(font) {
            font-size: 2rem;
        }

        .bitcoin-wrapper > span {
            padding-left: 1rem !important;
            font-size: 2rem !important;
        }
        .bitcoin-wrapper :global(svg) {
            padding: 0;
            font-size: 3rem !important;
        }

    }
        
</style>