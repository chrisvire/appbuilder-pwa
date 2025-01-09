<!--
@component
A simple modal component from DaisyUI. Closes when clicked outside of.

See https://daisyui.com/components/modal/#modal-that-closes-when-clicked-outside
-->
<script lang="ts">
    import { convertStyle, direction, s } from '$lib/data/stores';
    import type { Snippet } from 'svelte';

    let dialog: HTMLDialogElement;
    export function showModal() {
        //This exported function allows buttons/labels in other divs to trigger the modal popup (see handleTextAppearanceSelector() and handleCollectionSelector() in +page.svelte).
        dialog.showModal();
    }
    interface Props {
        id: any;
        useLabel?: boolean; //If this is set to false, there will be no button/label with this modal to open it, and the modal may be initialized without filling the label slot.
        addCSS?: string; //Here addCSS is a prop for injecting CSS into the modal contents div/form below.
        label?: Snippet;
        content?: Snippet;
        onclose?: () => void;
    }

    let { id, useLabel = true, addCSS = '', label, content }: Props = $props();
</script>

{#if useLabel}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <label for={id} class="dy-btn dy-btn-ghost p-0.5 dy-no-animation" onclick={{ id }.showModal()}>
        {@render label?.()}<!--Anything passed into this slot will trigger the modal popup when clicked-->
    </label>
{/if}

<!-- svelte-ignore attribute_global_event_reference -->
<dialog
    bind:this={dialog}
    {id}
    {onclose}
    class="dy-modal cursor-pointer"
    style:direction={$direction}
>
    <form
        method="dialog"
        style={convertStyle($s['ui.dialog']) + addCSS}
        class="dy-modal-box overflow-y-visible relative"
    >
        {@render content?.()}<!--This is the slot for the popup's actual contents-->
    </form>
    <form method="dialog" class="dy-modal-backdrop">
        <!--This allows the modal to be closed when the user taps outside of the contents div/form-->
        <button>close</button>
    </form>
</dialog>
