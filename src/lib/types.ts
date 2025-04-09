import type { BlurParams, CrossfadeParams, DrawParams, FlyParams, ScaleParams, SlideParams, TransitionConfig } from "svelte/transition"

export type LightningNodes = {
    publicKey: string,
    alias: string,
    channels: number,
    capacity: number,
    firstSeen: number | Date
    updatedAt: number,
    iso_code: string,
    subdivision: string,
    city: {
        [key: string]: string
    },
    country: {
        [key: string]: string
    }
}[]

export type SortableLightningProperties = "publicKey" | "alias" | "channels" | "capacity" | "firstSeen" | "updatedAt" | "iso_code"

export type AllTransitionParams = TransitionConfig | BlurParams | FlyParams | SlideParams | ScaleParams | DrawParams | CrossfadeParams
export type OptionalTransition = undefined | ((node: Element, {}: AllTransitionParams | undefined) => TransitionConfig)