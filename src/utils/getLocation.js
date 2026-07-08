export const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                // err.code: 1 = permission denied, 2 = position unavailable, 3 = timeout
                reject(err);
            },
            {
                enableHighAccuracy: true, // use GPS chip, not wifi/cell triangulation
                timeout: 10000,
                maximumAge: 0, // never use a cached position
            }
        );
    });