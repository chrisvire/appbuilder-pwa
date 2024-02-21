<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import VerseOnImage from '$lib/components/VerseOnImage.svelte';
    import { cropState, t } from '$lib/data/stores';
    import { DownloadIcon, ShareIcon } from '$lib/icons';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';

    let verseOnImage;
    export let data;

    async function share() {
        if (verseOnImage) {
            await verseOnImage.shareCanvas();
        }
    }

    async function download() {
        if (verseOnImage) {
            await verseOnImage.downloadCanvas();
        }
    }

    function handleSelectImage({ detail }: CustomEvent) {
        $cropState.selectedFile = detail.imageUrl;
        const url = `${base}/image/crop`;
        goto(url);
    }
</script>

<div class="grid grid-rows-[auto,1fr]" style="height:100vh;height:100dvh;">
    <div class="navbar">
        <Navbar>
            <!-- <div slot="left-buttons" /> -->
            <label for="sidebar" slot="center">
                <div class="btn btn-ghost normal-case text-xl">{$t['Text_On_Image_Title']}</div>
            </label>
            <div slot="right-buttons">
                <button class="dy-btn dy-btn-ghost dy-btn-circle" on:click={share}>
                    <ShareIcon color="white" />
                </button>
                <button class="dy-btn dy-btn-ghost dy-btn-circle" on:click={download}>
                    <DownloadIcon color="white" />
                </button>
            </div>
        </Navbar>
    </div>

    <div class="overflow-y-auto max-w-screen-sm mx-auto">
        <VerseOnImage
            bind:this={verseOnImage}
            on:selectImage={handleSelectImage}
            imageUrl={$cropState.croppedImage}
        />
    </div>
</div>
