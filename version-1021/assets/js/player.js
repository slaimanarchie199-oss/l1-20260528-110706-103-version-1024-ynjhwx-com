function initHlsPlayer(videoId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hls = null;
    var attached = false;

    if (!video || !overlay || !streamUrl) {
        return;
    }

    function attach() {
        if (attached) {
            return Promise.resolve();
        }
        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            return new Promise(function (resolve) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                hls.on(window.Hls.Events.ERROR, function (_event, data) {
                    if (data && data.fatal) {
                        hls.destroy();
                        hls = null;
                        video.src = streamUrl;
                        resolve();
                    }
                });
            });
        }

        video.src = streamUrl;
        return Promise.resolve();
    }

    function play() {
        overlay.classList.add("is-hidden");
        attach().then(function () {
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {});
            }
        });
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (!attached) {
            play();
        }
    });
}
