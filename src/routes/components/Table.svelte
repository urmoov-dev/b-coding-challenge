<script lang="ts">
	import type { LightningNodes, SortableLightningProperties } from "$lib/types";

    let {headers, lightningNodes, sortBy = $bindable(), formatValue} = $props()    
</script>

<div class="table-container flex flex-col">
    <table>
        <thead>
            <tr>
            {#each headers as header, i}
                <th class="{i < 1 ? "sticky-left" : ""} {header.key === sortBy ? "sorting" : ""}">
                    <span>{header.label}</span>
                {#if header.sortable}
                    <button onclick={() => {sortBy = header.key as SortableLightningProperties}}>+</button>
                {/if}
                </th>
            {/each}
            </tr>
        </thead>

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
    </table>
</div>

<style>
    .table-container {
        align-self: stretch;
        margin-inline: auto;
        color: var(--color-text-0);
        max-width: 70%;
        height: 90vh;
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
        z-index: 10;
    }

    th, td {
        padding: 1rem;
        white-space: nowrap;
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
    }

    .sticky-left:not(th) {
        background-color:  var(--color-bg-0);
    }

    .sorting * {
        color: var(--color-theme-1)
    }
</style>