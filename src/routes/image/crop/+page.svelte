<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import CropImage from '$lib/components/CropImage.svelte';
    import { cropState, t } from '$lib/data/stores';
    import { DoneIcon } from '$lib/icons';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    let cropImage;
    export let data;

    function doCropImage(
        imageUrl: string,
        left: number,
        top: number,
        width: number,
        height: number
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                console.log('imageUrl', imageUrl);
                console.log(`left=${left},top=${top},width=${width},height=${height}`);

                // Set canvas dimensions based on the desired width and height
                canvas.width = width;
                canvas.height = height;

                // Draw the image on the canvas with the desired cropping parameters
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, left, top, width, height, 0, 0, width, height);

                // Convert the canvas content to a data URL representing the cropped image
                resolve(canvas.toDataURL());
            };

            img.onerror = (error) => {
                reject(error);
            };

            img.src = imageUrl;
        });
    }

    async function handleCropImage() {
        try {
            console.log('HandleCropImage: cropBox=', cropImage.cropBox);
            const cropImageUrl = await doCropImage(
                $cropState.selectedFile,
                cropImage.cropBox.x,
                cropImage.cropBox.y,
                cropImage.cropBox.width,
                cropImage.cropBox.height
            );
            $cropState.croppedImage = cropImageUrl;
            const url = `${base}/image`;
            goto(url);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    }
</script>

<div class="grid grid-rows-[auto,1fr]" style="height:100vh;height:100dvh;">
    <div class="navbar">
        <Navbar>
            <!-- <div slot="left-buttons" /> -->
            <label for="sidebar" slot="center">
                <div class="btn btn-ghost normal-case text-xl">{$t['Crop_Image_Title']}</div>
            </label>
            <div slot="right-buttons">
                <button class="dy-btn dy-btn-ghost dy-btn-circle" on:click={handleCropImage}>
                    <DoneIcon color="white" />
                </button>
            </div>
        </Navbar>
    </div>

    <div class="overflow-y-auto max-w-screen-sm mx-auto">
        <CropImage bind:this={cropImage} imageUrl={$cropState.selectedFile} />
    </div>
</div>
