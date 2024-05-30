if (import.meta.env.CLEAR_CACHE) {
    if ('caches' in window) {
        caches.keys().then(names => {
            for (let name of names) {
                console.log("CLEAR_CACHE: Deleting ", name);
                caches.delete(name);
            }
        });
    }
}