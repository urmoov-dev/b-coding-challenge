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