import { getContext, setContext } from "svelte"

export type TargetContainer = {
    height?: number,
    width?: number,
    top?: number,
    left?: number,
    topOffset?: number,
    leftOffset?: number,
    node?: HTMLElement | Record<string, never>,
    refresh?: () => void,
    nested?: boolean,
    inTransition?: boolean,
}

// export class ExpansionTarget<T>{
//     height:number|undefined =  $state(0)
//     width:number|undefined = $state(0)
//     top:number|undefined = $state(0)
//     left:number|undefined = $state(0)
//     topOffset:number|undefined = $state(0)
//     leftOffset:number|undefined = $state(0)
//     node:HTMLElement|Record<string, never>|undefined = $state()
//     nested:boolean|undefined = $state()
//     inTransition:boolean|undefined = $state()

//     constructor(container:TargetContainer) {
//         this.height = container?.height  
//         this.width= container?.width
//         this.top= container?.top
//         this.left= container?.left
//         this.topOffset= container?.topOffset
//         this.leftOffset= container?.leftOffset
//         this.node= container?.node
//         this.nested= container?.nested
//         this.inTransition= container?.inTransition
//     }
// }

const CONTEXT_KEY = 'targetContainer'

/**
 * @param  {TargetContainer} targetContainer object containing the relevant info about the container
 * 
 * @param  {string} thisContextKey string key for the current context
 * 
 * @returns a reactive context of the target container data   
 */
export function setTargetContext(targetContainer:TargetContainer, thisContextKey:string = CONTEXT_KEY) {
    // const container = new ExpansionTarget(targetContainer)
    return setContext(thisContextKey, targetContainer)
}

export function getTargetContext(thisContextKey:string = CONTEXT_KEY):TargetContainer {
    return getContext<ReturnType<typeof setTargetContext>>(thisContextKey)
}