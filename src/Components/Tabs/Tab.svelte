<script context=module>
    export const TABS_KEY = {};
</script>
<script>
    import { getContext, onMount } from 'svelte';

    export let tab:string;

    let context = getContext<any>(TABS_KEY);
    let tabs = context.tabs;
    let selectedTab = context.selectedTab;

    onMount(() => {
        tabs.set([...$tabs, tab]);
    });
</script>

<div class:hidden={$selectedTab != tab}>
    <slot/>
</div>

<style>
    .hidden {
        visibility: collapse;
    }
</style>