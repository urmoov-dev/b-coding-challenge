<script lang="ts">
	import type { LightningNodes, SortableLightningProperties } from "$lib/types";
	import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { fade } from "svelte/transition";

    let {headers, lightningNodes, sortBy = $bindable(), formatValue} = $props()    
</script>

<div class="table-container flex flex-col top-0 left-0" in:fade={{delay: 300}} out:fade>
    <table>
        <tbody>
        {#each  lightningNodes as LightningNodes as node}
            <tr>
            {#each headers as header, i}
            {@const tdValue = formatValue(header.key, node)}
                <td class="{i < 1 ? "sticky-left" : ""}">{tdValue}</td>
            {/each}
            </tr>
        {/each}
        </tbody>
        <thead>
            <tr>
            {#each headers as header, i}
                <th class="{i < 1 ? "sticky-left absolute z-20" : ""} {header.key === sortBy ? "sorting" : ""}">
                    <span>{header.label}</span>
                {#if header.sortable}
                    <button class="pr-2" 
                        onclick={() => {sortBy = header.key as SortableLightningProperties}}
                    >
                        <Fa icon={faCaretDown}/>
                    </button>
                {/if}
                </th>
            {/each}
            </tr>
        </thead>

    </table>
</div>

<style>
    .table-container {
        align-self: stretch;
        margin-inline: auto;
        color: var(--color-text-0);
        width: clamp(min(65rem, 98%), calc(50% + 25rem), 1920px);
        height: 100%;
        max-width: white;
        overflow: auto;
        border-radius: 1rem;
    }

     table {
        width: 100%;
        border-collapse: collapse;
        background: var(--color-bg-0);
        padding: 1rem;
    }

    thead{
        position: sticky;
        top: 0;
    }

    th, td {
        padding: 1rem;
        white-space: nowrap;
        overflow-x: auto;
    }

    th {
        position: relative;
        text-align: left;
        background: var(--color-bg-2);
    }

    tr:nth-of-type(2n),   tr:nth-of-type(2n) > .sticky-left  {
        background: var(--color-bg-1)
    }

    th > span {
        margin-right: 2ch;
    }

    th > button {
        border: none;
        position:absolute;
        right: 0;
        cursor: pointer;
        background-color: var(--color-grey);
    }

    .sticky-left {
        position: sticky;
        left: 0px;
        z-index: 10;
        max-width: 30vw;
    }

    .sticky-left:not(th) {
        background-color:  var(--color-bg-0);
    }

    .sorting * {
        color: var(--color-theme-1)
    }
    
    @media (orientation: portrait) and (max-width: 1000px) {
        
        .table-container {
            position: relative;
            width: 98%;
        }
    }
</style>