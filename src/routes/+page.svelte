<script lang="ts">
    import type { LightningNodes, SortableLightningProperties } from "$lib/types";
	import { onMount } from "svelte";
	import { quartIn } from "svelte/easing";
	import { fade } from "svelte/transition";
    
    const { data } = $props()
    const locale = $derived(data.locale)

    let fetchedNodes = $state<LightningNodes>()
    let lightningNodes = $state<LightningNodes>()
    let sortBy = $state<SortableLightningProperties>('capacity')

    $effect(() => {
        if (fetchedNodes) {
            lightningNodes = fetchedNodes.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return 1
                if (a[sortBy] > b[sortBy]) return -1
                return 0
            })
        }
    })

    const headers = [
        {
            label: "Alias",
            key: "alias",
            sortable: true
        },
        {
            label: "Capacity",
            key: "capacity",
            sortable: true
        },
        {
            label: "Updated At",
            key: "updatedAt",
            sortable: true
        },
        {
            label: "Channels",
            key: "alias",
            sortable: true
        },
        {
            label: "First Seen",
            key: "firstSeen",
            sortable: true
        },
        {
            label: "ISO Code",
            key: "iso_code",
            sortable: true
        },
        {
            label: "Public Key",
            key: "publicKey",
            sortable: true
        },
        {
            label: "Subdivision",
            key: "subdivision",
            sortable: false
        },
    ]

    function formatValue(key:string, obj: LightningNodes[0]) {
        const rawValue = obj[key as SortableLightningProperties];

        if (key === "capacity") return `${obj[key]/100000000} BTC`;

        if (key === "updatedAt" || key === "firstSeen") {
            const date = new Date(rawValue as number* 1000);
            return date.toLocaleString(locale)
        }

        if (key === "subdivision") {
            const localeSubdivision = JSON.parse(rawValue as string)
            const parsedLocale = locale === "pt-br" ? "pt-BR" 
                : locale === "zh-cn" ? "zh-CN" : locale 
            return localeSubdivision?.[parsedLocale]
        }

        return rawValue
    }

    onMount(async () => {
        const response = await fetch("https://mempool.space/api/v1/lightning/nodes/rankings/connectivity")
        const json = await response.json()
        fetchedNodes = json
    })

</script>

{#if !fetchedNodes}
 Loading....
{:else}
<div class="table-container flex flex-col" in:fade={{duration: 500, easing: quartIn}} out:fade={{duration:500}}>
    <table>
        <thead>
            <tr>
            {#each headers as header}
                <th>
                    {header.label}
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
            {#each headers as header}
            {@const tdValue = formatValue(header.key, node)}
                <td>{tdValue}</td>
            {/each}
            </tr>            
        {/each}
        </tbody>
    </table>
</div>
{/if}

<style>
    .table-container {
        align-self: stretch;
        margin-inline: auto;
        color: white;
        max-width: 90%;
        height: 90vh;
        max-width: white;
        overflow: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: #323232;
        padding: 1rem;
    }

    th, td {
        padding: 1rem;
        white-space: nowrap;
    }

    th {
        text-align: left;
        background: hsl(0 0% 0% / 0.5);
    }

    button {
        cursor: pointer
    }

</style>