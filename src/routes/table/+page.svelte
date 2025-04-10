<script lang="ts">
	import { getLocale } from "$lib/paraglide/runtime.js";
    import type { LightningNodes, SortableLightningProperties } from "$lib/types";
	import { onMount } from "svelte";
	import { setPageState } from "$lib/functions/forPageState";
	import Table from "../components/Table.svelte";
    
    const locale = getLocale()

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
            key: "channels",
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
            sortable: false
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

        const parsedLocale = locale === "pt-br" ? "pt-BR" 
        : locale === "zh-cn" ? "zh-CN" : locale;

        if (key === "updatedAt" || key === "firstSeen") {
            const date = new Date(rawValue as number* 1000);
            return date.toLocaleString(parsedLocale)
        }
        
        if (key === "shortTime") {
            const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
            
            return Intl.DateTimeFormat(locale, {
                dateStyle: "short",
                timeStyle: "short"
            }).format(date)
        }

        if (key === "subdivision") {
            const localeSubdivision = JSON.parse(rawValue as string)
            
            return localeSubdivision?.[parsedLocale]
        }

        return rawValue
    }

    async function fetchFromAPI() {
        const response = await fetch("https://mempool.space/api/v1/lightning/nodes/rankings/connectivity")
        const json = await response.json()
        return json
    }

    onMount(async () => {
        fetchedNodes = await fetchFromAPI()
        setPageState("table", "view", "push")
    })

</script>

<div class="component-positioner relative mx-auto">
    <Table {lightningNodes} bind:sortBy {headers} {formatValue}></Table>
</div>

<style>
    .component-positioner {
        height: 100%;
        width: clamp(min(65rem, 98%), calc(50% + 25rem), 1920px);
    }
</style>