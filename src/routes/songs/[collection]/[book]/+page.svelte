<script lang="ts">
    import { goto } from '$app/navigation';
    import BookSelector from '$lib/components/BookSelector.svelte';
    import ChapterSelector from '$lib/components/ChapterSelector.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import contents from '$lib/data/contents';
    import { contentsStack } from '$lib/data/stores';
    import { getRoute } from '$lib/navigate';

    function backNavigation() {
        if ($contentsStack.length > 0) {
            const menuId = contentsStack.popItem();
            goto(getRoute(`/contents/${menuId}`));
        }
    }
    $: showBackButton =
        contents?.features?.['navigation-type'] === 'up' && $contentsStack.length > 0;
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
</div>
