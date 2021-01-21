<script>
    import { TABS_KEY } from './Tab.svelte';
    import { setContext, onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const tabs = writable([]);
    const selectedTab = writable(null);

    setContext(TABS_KEY, {
        tabs,
        selectedTab
    });

    onMount(() => {
        if($tabs.length > 0)
            $selectedTab = $tabs[0];
    });
</script>

<div class=container>
    <div class=tabs-container>
        {#each $tabs as tab, i}
            <div class=tab-container>
                <div class=tab-block>
                    <div class=tab class:selected={$selectedTab == tab} on:click={() => $selectedTab = tab}>
                        <div class=tab-icon>
                            {i + 1}
                        </div>
                        <div class=tab-label>
                            {tab}
                        </div>
                    </div>
                </div>
                {#if i < $tabs.length - 1}
                    <div class=line/>
                {/if}
            </div>
        {/each}
    </div>
    <div class=content>
        <slot/>
    </div>
</div>

<style>
    @import '../../variables.less';
    
    @tab-size: 50px;

    .line {
        width: @line-width;
        height: @tab-size * 0.5;
        background-color: var(--gray-9);
    }

    .tab-container {
        flex-direction: column;
        align-items: center;
    }

    .container {
        /* margin: @spacing * 2; */
    }

    .content {
        margin: @spacing * 2;
    }

    .tabs-container {
        flex-direction: column;
        padding: @spacing * 2;
        background-color: var(--gray-1);
        /* margin-right: @spacing * 2; */
    }

    .tab-block {
        position: relative;
        height: @tab-size;
        width: @tab-size;
    }

    .tab-icon {
        min-width: (@tab-size - 2*@line-width);
        min-height: $min-width;
        align-items: center;
        justify-content: center;
        font-family: @serif;
        font-size: 1.25em;
        font-weight: bold;
    }

    .tab-label {
        padding-right: 1em;
    }

    .tab {
        flex-grow: 1;
        position: absolute;
        box-sizing: border-box;

        max-width: @tab-size;
        max-height: @tab-size;

        color: var(--gray-9);
        background-color: var(--gray-1);

        border-radius: @tab-size * 0.5;
        border: @line-width solid var(--gray-9);


        overflow: hidden;
        align-items: center;

        cursor: pointer;
        
        &.selected {
            background-color: var(--blue-4);
        }

        &:hover {
            max-width: unset;
            box-shadow: 2px 4px var(--gray-9);
        }
    }
</style>