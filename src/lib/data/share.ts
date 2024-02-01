import { getMimeType } from '$lib/scripts/stringUtils';

function createShareFile(text: string, filename: string) {
    return new File([text], filename, { type: 'text/plain' });
}

export async function shareText(
    title: string,
    text: string,
    filename: string,
    preferShareFile: boolean = false
) {
    let file;
    try {
        if (navigator.share) {
            let shareData: ShareData = { title, text };
            if (preferShareFile) {
                file = createShareFile(text, filename);
                const files = [file];
                if (navigator.canShare && navigator.canShare({ files })) {
                    shareData = { ...shareData, text: '', files };
                }
            }

            await navigator.share(shareData);
            return;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Sharing aborted');
            return;
        }
        console.error('Error sharing: ', error);
    }

    // if we're here, we failed to share, so we'll try to use the download link
    const shareFile = createShareFile(title + '\n\n' + text, filename);
    const url = URL.createObjectURL(shareFile);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
}

export async function shareImage(filename: string, image: Blob) {
    const type = getMimeType(filename);
    console.log(`Sharing ${filename} as ${type}`);
    const file = new File([image], filename, { type: type });
    try {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            const shareData: ShareData = { files: [file] };

            await navigator.share(shareData);
            return;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Sharing aborted');
            return;
        }
        console.error('Error sharing: ', error);
    }

    // if we're here, we failed to share, so we'll try to use the download link
    const url = URL.createObjectURL(file);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
}
