import { pushState, replaceState } from "$app/navigation";
import { page } from "$app/state";
import { setToValue } from "./forObjects";

export async function setPageState(value: any, path:string, method = "push") {
    
    const newState = {...page.state}
    setToValue(newState, value, path)

    if (method === "push") pushState('', newState)
    if (method === "replace") replaceState('', newState)
}

export type PageStateKey = keyof typeof page.state 