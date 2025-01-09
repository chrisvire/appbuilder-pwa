<script lang="ts">
    // Right facing chevron from https://fonts.google.com/icons
    // Filled = 0
    // Weight = 400
    // Grade = 0

    interface Props {
        // Optical size = 24px
        color?: string;
        size?: number;
        // degree of rotation
        deg?: number;
    }

    let { color = 'black', size = 24, deg = 0 }: Props = $props();
</script>

<svg fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    ><g transform="rotate({deg} 12 12)"
        ><path d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" /></g
    ></svg
>
