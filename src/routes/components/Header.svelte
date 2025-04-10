<script lang="ts">
	import { page } from "$app/state";
	import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
	import { getLayoutState } from "$lib/components/layout-state.svelte";
	import ThemeManager from "$lib/components/ThemeManager.svelte";
	import { type PageStateKey } from "$lib/functions/forPageState";
	import { setPageState } from "$lib/functions/forPageState";
	import { faList, faTable } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    const layout = getLayoutState()

</script>

<header>
    <img src="/logo.png" alt="logo" class="logo">
    {#if !layout.portrait || layout.width > 1000}
        <nav class="flex gap-[5vw]">
            <button class="flex items-center gap-3"
                onclick={() => {setPageState("table", "view", "push")}}
                class:selected={page.state["view" as PageStateKey] === "table"}
            >
                <Fa icon={faTable}/>
                Table
            </button>
            <button class="flex items-center gap-3"
                onclick={() => {setPageState("list", "view", "push")}}
                class:selected={page.state["view" as PageStateKey] === "list"}
            >
                <Fa icon={faList}/>
                List
            </button>
        </nav>
    {/if}
    <div class="flex">
        <ThemeManager fontSize="1rem" horizontal={true}></ThemeManager>
        <LanguageSwitch></LanguageSwitch>
    </div>
</header>

<style>
    header {
        height:10dvh;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    button {
        font-size: 2rem;
        padding: 0.2rem 0.9rem;
        border-radius: 1rem;
    }

    img {
        height: 60%;
    }
    .selected {
        background-color: var(--color-theme-1);
    }
</style>