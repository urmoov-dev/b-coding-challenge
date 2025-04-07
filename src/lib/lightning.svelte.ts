import { getContext, setContext } from "svelte"
import type { LightningNodes, SortableLightningProperties } from "./types"

export class LightningState {
    nodes = $state<LightningNodes>()
    sortedNodes = $state<LightningNodes>()
    sortBy = $state<SortableLightningProperties>("capacity")

    constructor() {

        $effect(() => {
            if (this?.nodes) {
                this.sortedNodes = this.nodes.sort((a, b) => {
                    if (a[this.sortBy] < b[this.sortBy]) return 1
                    if (a[this.sortBy] > b[this.sortBy]) return -1
                    return 0
                })
            }
        })
    }
}

const LIGHTNING_KEY = Symbol("LIGHTNING")

export function setLightningContext() {
    return setContext(LIGHTNING_KEY, new LightningState)
}

export function getLightning() {
    return getContext<ReturnType<typeof setLightningContext>>(LIGHTNING_KEY)
}