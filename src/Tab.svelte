<script>
    import { tabsKey } from './TabControl.svelte'
    import { getContext, onMount } from 'svelte';

    export let tab:string;

    let context = getContext<any>(tabsKey);
    let tabs = context.tabs;
    let selectedTab = context.selectedTab;

    onMount(() => {
        tabs.set([...$tabs, tab]);
    });
</script>

<div class=grow class:hidden={$selectedTab != tab}>
    <slot/>
</div>

<style>
    .hidden {
        visibility: collapse;
    }
</style>