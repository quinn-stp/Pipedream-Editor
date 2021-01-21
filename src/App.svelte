<script>
    import './style.less';

    import TimelineTabControl from './Components/Tabs/TimelineTabControl.svelte';
    import Tab from './Components/Tabs/Tab.svelte';
    import BoardSelectionPage from './BoardSelectionPage.svelte';
</script>

<TimelineTabControl>
    <Tab tab="Board Selection">
        <BoardSelectionPage/>
    </Tab>
    <Tab tab="Pipeline">
    </Tab>
</TimelineTabControl>