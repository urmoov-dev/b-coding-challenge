<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { getLayoutState } from "$lib/components/layout-state.svelte";
	import { setPageState, type PageStateKey } from "$lib/functions/forPageState";
	import { faList, faTable } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    const layout = getLayoutState()
</script>

{#if layout.portrait || layout.width <= 1000}
    <div class="thumb-navigation flex justify-evenly w-full">
        <button class="flex items-center gap-3"
            onclick={async() => {await goto("/");setPageState("table", "view", "push")}}
            class:selected={page.state["view" as PageStateKey] === "table"}
        >
            <Fa icon={faTable}/>
        </button>
        <button class="flex items-center gap-3"
            onclick={async() => { await goto("/");setPageState("list", "view", "push")}}
            class:selected={page.state["view" as PageStateKey] === "list"}
        >
            <Fa icon={faList}/>
        </button>
    </div>
{/if}

<style>
    .thumb-navigation {
        height: 8dvh;
    }
    
    button {
        font-size: 2rem;
        padding: 0.2rem 0.9rem;
        border-radius: 1rem;
    }
    .selected {
        background-color: var(--color-theme-1);
    }

</style>