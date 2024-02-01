<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import VerseOnImage from '$lib/components/VerseOnImage.svelte';
    import { t } from '$lib/data/stores';
    import { DownloadIcon, ShareIcon } from '$lib/icons';
    let verseOnImage;
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
</script>

<div class="grid grid-rows-[auto,1fr]" style="height:100vh;height:100dvh;">
    <div class="navbar">
        <Navbar>
            <!-- <div slot="left-buttons" /> -->
            <label for="sidebar" slot="center">
                <div class="btn btn-ghost normal-case text-xl">{$t['Text_On_Image_Title']}</div>
            </label>
            <div slot="right-buttons">
                <button class="dy-btn-sm dy-btn-ghost" on:click={share}>
                    <ShareIcon color="white" />
                </button>
                <button class="dy-btn-sm dy-btn-ghost" on:click={download}>
                    <DownloadIcon color="white" />
                </button>
            </div>
        </Navbar>
    </div>

    <div class="overflow-y-auto" style="border:0px solid orange;">
        <VerseOnImage bind:this={verseOnImage} />
    </div>
</div>
