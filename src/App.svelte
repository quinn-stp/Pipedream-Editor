<script>
    import LayoutEditor from './LayoutEditor.svelte'
    import PipelineEditor from './PipelineEditor.svelte';
    import TabControl from './TabControl.svelte';
    import Tab from './Tab.svelte';
    import type { KeyModel } from './LayoutEditor.svelte';

    let layout:KeyModel[] = [
        {
            id: 0,
            labels: {
                Main: 'Q'
            },
            selected: false,
            x: 0,
            y: 0,
            width: 1,
            height: 1
        },
        {
            id: 1,
            labels: {
                Main: 'W'
            },
            selected: false,
            x: 1,
            y: 0,
            width: 1,
            height: 1
        }
    ];
</script>

<main>
    <TabControl>
        <Tab tab="Layout">
            <LayoutEditor bind:keys={layout}/>
        </Tab>
        <Tab tab="Pipeline">
            <PipelineEditor keys={layout}/>
        </Tab>
    </TabControl>
</main>

<style>
    .gradient-loop(@start, @end, @color, @i: 1) when (@i <= 8) {
        --@{color}-@{i}: mix(@end, @start, @i*10);
        .gradient-loop(@start, @end, @color, (@i + 1));
    }

    .gradient(@start, @end, @color) {
        --@{color}-0: @start;
        .gradient-loop(@start, @end, @color);
        --@{color}-9: @end;
    }

    :global(:root) {
        .gradient(#181818, #eee, gray);
        .gradient(#181818, rgb(151, 187, 253), blue);
        .gradient(#181818, rgb(255, 69, 69), red);
    }

    :global(.fill) {
        width: 100%;
        height: 100%;
    }

    :global(.grow) {
        flex-grow: 1;
    }

    :global(.row) {
        flex-direction: row;
        align-items: flex-start;
    }

    :global(.stretch-row) {
        flex-direction: row;
        align-items: stretch;
        flex-grow: 1;
    }

    :global(.column) {
        flex-direction: column;
        align-items: flex-start;
    }

    :global(.stretch-column) {
        flex-direction: column;
        align-items: stretch;
        flex-grow: 1;
    }

	:global(main) {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--gray-0);
	}

    :global(div) {
        display: flex;
        user-select: none;
    }

    :global(input) {
        display: flex;
    }

    :global(body) {
        padding: 0;
    }
</style>