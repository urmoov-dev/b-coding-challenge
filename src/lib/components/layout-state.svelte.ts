import { getContext, setContext } from "svelte";

export class LayoutState<T>{
    
    width = $state(0);
    height = $state(0);
    headerHeight = $state(0);
    showMenu = $state(false);
    thumbNav = $state({
        mounted: false,
        hide: false,
        lastRoute: "",
        route: "",
        direction: 0,
    });
    appStatePivot = $state({})
    virtualKeyboard = $state(false)
    portrait = $state(true)
    config = $state({
        duration: 0
    })

    toggleThumbNav() {
        this.thumbNav.mounted = !this.thumbNav.mounted
    }

    /**
     * @param  {boolean} toggleTo reveal the menu?
     * @returns void
     */
    toggleMenu(toggleTo = !this.showMenu) {
        this.showMenu = toggleTo
    }
    
}

const CONTEXT_KEY = Symbol('LayoutState')

export function setLayoutState() {
    return setContext(CONTEXT_KEY, new LayoutState)
}

export function getLayoutState() {
    return getContext<ReturnType<typeof setLayoutState>>(CONTEXT_KEY)
}