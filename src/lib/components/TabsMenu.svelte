<!--
@component
A component to display tabbed menus.
-->
<svelte:options ={true} />

<script lang="ts">
    import { convertStyle, s } from '$lib/data/stores';
    import { createEventDispatcher } from 'svelte';

    interface Props {
        options?: App.TabMenuOptions;
        active?: any;
        scroll?: boolean;
        height?: string;
    }

    let {
        options = { '': { component: '', props: {}, visible: true } },
        active = $bindable(Object.keys(options).filter((x) => options[x].visible)[0]),
        scroll = true,
        height = '50vh'
    }: Props = $props();

    const dispatch = createEventDispatcher();
    const hasTabs = Object.keys(options).filter((x) => options[x].visible).length > 1;
    function handleMenuaction({ detail }: CustomEvent) {
        dispatch('menuaction', {
            text: detail.text,
            url: detail?.url,
            tab: active
        });
    }

    /**sets the active tab*/
    export const setActive = (tab: string) => {
        if (!Object.hasOwn(options, tab)) return;
        active = tab;
    };

    const SvelteComponent_1 = $derived(options[active].component);

    export {
    	options,
    	active,
    	scroll,
    	height,
    }
</script>

{#if hasTabs}
    <div class="dy-tabs mb-1" style={convertStyle($s['ui.selector.tabs'])}>
        {#each Object.keys(options) as opt}
            {#if options[opt].visible}
                <!-- svelte-ignore a11y_missing_attribute -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_interactive_supports_focus -->
                <a
                    onclick={() => setActive(opt)}
                    style:border-color={active === opt ? '#FFFFFF' : ''}
                    class="dy-tab dy-tab-bordered text-white normal-case {active === opt
                        ? 'dy-tab-active'
                        : ''}"
                    style:background="none"
                    role="button"
                >
                    {#if options[opt].tab}
                        {@const SvelteComponent = options[opt].tab?.component}
                        <SvelteComponent
                            {...options[opt].tab?.props}
                        />
                    {:else}
                        {opt}
                    {/if}
                </a>
            {/if}
        {/each}
    </div>
{/if}
<div
    style={convertStyle($s['ui.background'])}
    class:p-2={!hasTabs}
    style:overflow-y={scroll ? 'auto' : ''}
    style:max-height={height}
>
    <SvelteComponent_1
        collectionMenuAction={handleMenuaction}
        {...options[active].props}
    />
</div>
