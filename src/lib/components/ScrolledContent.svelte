<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
    import { mainScroll } from '$lib/data/stores';
    import { onMount } from 'svelte';
    let main: HTMLElement;

    export const updateScroll = (() => {
        let updateTimer: NodeJS.Timeout;
        return () => {
            clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
                $mainScroll = { top: main.scrollTop, height: main.clientHeight };
            }, 50);
        };
    })();

    onMount(updateScroll);
</script>

<div class="p-2 w-full" bind:this={main} on:scroll={updateScroll}>
    <main>
        <slot name="scrolled-content" />
    </main>
</div>
