window.Strategies = window.Strategies || {};
window.Strategies.YouTube = {
    matches: () => window.location.hostname.includes('youtube.com'),

    inject: (video, root) => {
        const container = video.closest('.html5-video-player');
        if (!container) return;

        if (container.querySelector('.volume-control-container')) return;

        const leftControls = container.querySelector('.ytp-left-controls');
        if (leftControls) {
            const volArea = leftControls.querySelector('.ytp-volume-area');
            // If we force the volume, the volume will go to 100% momentarily. Bad bad
            const wrapper = window.VolumeUtils.createVolumeInput(video, false, false);

            if (volArea) {
                window.DomUtils.injectAfter(video, volArea, wrapper);
            } else {
                leftControls.appendChild(wrapper);
            }
        }
    }
};
