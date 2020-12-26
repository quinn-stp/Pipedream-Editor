<script context=module>
    export const tabsKey = {};
</script>

<script>
    import { setContext, onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const tabs = writable([]);
    const selectedTab = writable(null);

    setContext(tabsKey, {
        tabs,
        selectedTab
    });

    onMount(() => {
        if($tabs.length > 0)
            $selectedTab = $tabs[0];
    });
</script>

<div class="row grow tab-control-container">
    <div class="column">
        {#each $tabs as tab}
            <div class="tab" class:tab-selected={tab == $selectedTab} on:click={() => $selectedTab = tab}>
                <div class="tab-icon-container">

                    <svg viewBox="-10 -10 53 53">
                        <path d="M22,10h-9V6c0-0.55-0.45-1-1-1V2c0-0.55-0.45-1-1-1H5C4.45,1,4,1.45,4,2v3C3.45,5,3,5.45,3,6v7c0,3.86,3.14,7,7,7h9v6   c0,0.55,0.45,1,1,1v3c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1v-3c0.55,0,1-0.45,1-1v-9C29,13.14,25.86,10,22,10z M6,3h4v2H6V3z    M26,29h-4v-2h4V29z"/>
                    </svg>

                </div>
                {tab}
            </div>
        {/each}
    </div>
    <div class="fill tab-content-container">
        <slot/>
    </div>
</div>

<style>
    @radius: 5px;
    @tab-height: 3em;
    @tab-width: 10em;

    .tab-icon-container {
        height: @tab-height * 0.8;
        width: @tab-height * 0.8;
        border-radius: (@tab-height * 0.8 / 2);
        margin: @tab-height * 0.1;
        background-color: var(--gray-1);
        align-items: center;
        justify-content: center;
        align-content: center;
    }

    .tab:hover > .tab-icon-container {
        background-color: var(--gray-2);
    }

    .tab-selected > .tab-icon-container {
        background-color: var(--blue-6) !important;
    }

    .tab-content-container {
        margin-left: 10px;
    }

    .tab-control-container {
        border-radius: @radius;
        margin: 20px;
        overflow: hidden;
    }

    .tab-selected {
        position: relative;
        background-color: var(--gray-1) !important;
        color: var(--gray-9) !important;
    }

    .tab-selected path {
        stroke: var(--gray-9) !important;
        fill: var(--gray-9) !important;
    }

    .tab:hover {
        background-color: var(--gray-1);
    }

    .tab path {
        stroke: var(--gray-5);
        fill: var(--gray-5);
    }

    .tab {
        height: @tab-height;
        width: @tab-width;
        justify-content: flex-start;
        align-items: center;
        color: var(--gray-5);
        border-radius: @radius;
        user-select: none;
        cursor: pointer;
        margin-bottom: 5px;
    }

</style>