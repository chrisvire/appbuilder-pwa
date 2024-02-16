<script>
    import { onMount, createEventDispatcher } from 'svelte';

    export let imageUrl;

    const dispatch = createEventDispatcher();

    let image;
    let cropBox = {
        x: 0,
        y: 0,
        size: 0,
        width: 0,
        height: 0
    };

    let lastTouchX, lastTouchY;
    let isDragging = false;
    let startX, startY;
    let pinchStartDistance, initialCropSize;

    const calculateCropBox = () => {
        const imageSize = Math.min(image.width, image.height);
        cropBox.size = Math.round(0.9 * imageSize);
        cropBox.width = cropBox.size;
        cropBox.height = cropBox.size;
        cropBox.x = (image.width - cropBox.size) / 2;
        cropBox.y = (image.height - cropBox.size) / 2;
    };

    onMount(() => {
        image.onload = () => {
            calculateCropBox();
        };
    });

    // const handleMouseDown = (event) => {
    //     isDragging = true;
    //     startX = event.clientX - cropBox.x;
    //     startY = event.clientY - cropBox.y;
    // };

    // const handleMouseMove = (event) => {
    //     if (isDragging) {
    //         cropBox.x = event.clientX - startX;
    //         cropBox.y = event.clientY - startY;
    //         keepOnScreen();
    //     }
    // };

    // const handleMouseUp = () => {
    //     isDragging = false;
    // };

    // const handleMouseLeave = () => {
    //     isDragging = false;
    // };

    // const handleTouchStart = (event) => {
    //     const touch = event.touches[0];
    //     startX = touch.clientX - cropBox.x;
    //     startY = touch.clientY - cropBox.y;
    //     isDragging = true;
    // };

    // const handleTouchMove = (event) => {
    //     if (isDragging) {
    //         const touch = event.touches[0];
    //         cropBox.x = touch.clientX - startX;
    //         cropBox.y = touch.clientY - startY;
    //         keepOnScreen();
    //     }
    // };

    // const handleTouchEnd = () => {
    //     isDragging = false;
    // };

    const handleMouseDown = (event) => {
        event.preventDefault();
        isDragging = true;
        startX = event.clientX - cropBox.x;
        startY = event.clientY - cropBox.y;
    };

    const handleTouchStart = (event) => {
        if (event.touches.length === 1) {
            lastTouchX = event.touches[0].clientX;
            lastTouchY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            pinchStartDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            initialCropSize = cropBox.size;
        }
    };

    const handleTouchMove = (event) => {
        if (event.touches.length === 1 && !pinchStartDistance && !initialCropSize) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            cropBox.x += touchX - lastTouchX;
            cropBox.y += touchY - lastTouchY;
            keepOnScreen(); // Ensure the crop box stays within the image bounds
            lastTouchX = touchX;
            lastTouchY = touchY;
        } else if (event.touches.length === 2 && pinchStartDistance && initialCropSize) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const pinchCurrentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            const pinchDelta = pinchCurrentDistance - pinchStartDistance;
            const newSize = Math.max(50, initialCropSize + pinchDelta * 0.1); // Adjust sensitivity as needed
            cropBox.size = newSize;
            cropBox.width = newSize;
            cropBox.height = newSize;
            cropBox.x = cropBox.x + (initialCropSize - newSize) / 2;
            cropBox.y = cropBox.y + (initialCropSize - newSize) / 2;
            keepOnScreen();
        }
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            cropBox.x = event.clientX - startX;
            cropBox.y = event.clientY - startY;
            keepOnScreen();
        }
    };

    const keepOnScreen = () => {
        cropBox.x = Math.min(Math.max(cropBox.x, 0), image.width - cropBox.width);
        cropBox.y = Math.min(Math.max(cropBox.y, 0), image.height - cropBox.height);
    };

    const handleMouseWheel = (event) => {
        const delta = Math.max(-1, Math.min(1, event.deltaY));
        cropBox.size += delta * 10; // Adjust the sensitivity as needed
        cropBox.size = Math.max(50, Math.min(cropBox.size, Math.min(image.width, image.height)));
        keepOnScreen();
    };

    const handleCrop = () => {
        dispatch('crop', cropBox);
    };
</script>

<!-- class="relative overflow-hidden"
on:mousedown={handleMouseDown}
on:mousemove={handleMouseMove}
on:mouseup={handleMouseUp}
on:mouseleave={handleMouseLeave}
on:touchstart={handleTouchStart}
on:touchmove={handleTouchMove}
on:touchend={handleTouchEnd}
on:touchcancel={handleTouchEnd}
on:wheel={handleMouseWheel} -->
<div
    class="relative overflow-hidden"
    style="touch-action: none;"
    on:mousedown={handleMouseDown}
    on:mouseup={handleMouseUp}
    on:mousemove={handleMouseMove}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
>
    {#if imageUrl}
        <img
            src={imageUrl}
            alt="Image"
            bind:this={image}
            class="inset-0 object-cover opacity-100 transition-opacity duration-300"
        />
    {/if}

    {#if image}
        <!-- Top Scrim -->
        <div
            class="absolute inset-0"
            style="background-color: rgba(0, 0, 0, 0.5); z-index: 1; top: 0; left: 0; width: 100%; height: {cropBox.y}px;"
        ></div>

        <!-- Bottom Scrim -->
        <div
            class="absolute"
            style="background-color: rgba(0, 0, 0, 0.5); z-index: 1; top: {cropBox.y +
                cropBox.height}px; left: 0; width: 100%; height: calc(100% - {cropBox.y +
                cropBox.height}px);"
        ></div>

        <!-- Left Scrim -->
        <div
            class="absolute"
            style="background-color: rgba(0, 0, 0, 0.5); z-index: 1; top: {cropBox.y}px; left: 0; width: {cropBox.x}px; height: {cropBox.height}px;"
        ></div>

        <!-- Right Scrim -->
        <div
            class="absolute"
            style="background-color: rgba(0, 0, 0, 0.5); z-index: 1; top: {cropBox.y}px; right: 0; width: calc(100% - {cropBox.x +
                cropBox.width}px); height: {cropBox.height}px;"
        ></div>

        <!-- Crop box -->

        <div
            class="absolute border-4 border-white pointer-events-none"
            style="
          left: {cropBox.x}px;
          top: {cropBox.y}px;
          width: {cropBox.width}px;
          height: {cropBox.height}px;
          z-index:2;
        "
        ></div>
    {/if}
</div>
