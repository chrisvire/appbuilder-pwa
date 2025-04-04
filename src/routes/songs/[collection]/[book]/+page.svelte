<script lang="ts">
    import { goto } from '$app/navigation';
    import BookSelector from '$lib/components/BookSelector.svelte';
    import ChapterSelector from '$lib/components/ChapterSelector.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import contents from '$lib/data/contents';
    import { contentsStack, convertStyle, s, t } from '$lib/data/stores';
    import { getRoute } from '$lib/navigate';

    function backNavigation() {
        if ($contentsStack.length > 0) {
            const menuId = contentsStack.popItem();
            goto(getRoute(`/contents/${menuId}`));
        }
    }
    $: showBackButton =
        contents?.features?.['navigation-type'] === 'up' && $contentsStack.length > 0;

    $: selectedTab = contents?.features?.['song-number-layout'] ? 'numbers' : 'songs';
</script>

<div class="grid grid-rows-[auto,1fr]" style="height:100vh;height:100dvh;">
    <div class="navbar">
        <Navbar {backNavigation} {showBackButton}>
            {#snippet start()}
                <div class="flex flex-nowrap">
                    <BookSelector />
                    <ChapterSelector />
                </div>
            {/snippet}
        </Navbar>
    </div>

    <div class="overflow-y-auto mx-auto md:max-w-screen-md w-full">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            role="tablist"
            class="dy-tabs dy-tabs-bordered"
            style={convertStyle($s['ui.song.tabs'])}
        >
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                name="tabs_1"
                class="dy-tab dy-tab-bordered {selectedTab === 'numbers' ? 'dy-tab-active' : ''}"
                on:click={() => (selectedTab = 'numbers')}
                aria-label="by number tab"
                style={convertStyle($s['ui.song.number.text'])}
            >
                <span class="dy-tab-text">{$t['Song_List_By_Number']}</span>
            </div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                name="tabs_1"
                class="dy-tab dy-tab-bordered {selectedTab === 'titles' ? 'dy-tab-active' : ''}"
                on:click={() => (selectedTab = 'titles')}
                aria-label="by title tab"
                style={convertStyle($s['ui.song.title.text'])}
            >
                <span class="dy-tab-text">{$t['Song_List_By_Title']}</span>
            </div>
        </div>
    </div>
</div>
