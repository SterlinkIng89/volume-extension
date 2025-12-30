window.ExtensionSettings = { defaultVolume: 0.05 };

// Load settings
if (chrome.storage) {
    chrome.storage.sync.get(['defaultVolume'], (result) => {
        if (result.defaultVolume !== undefined) {
            window.ExtensionSettings.defaultVolume = result.defaultVolume;
        }
    });
}

function enforceVolume(event) {
    const video = event.target;
    if (video.tagName !== 'VIDEO') return;

    if (!video.dataset.defaultVolumeApplied) {
        const defVol = (window.ExtensionSettings && window.ExtensionSettings.defaultVolume !== undefined)
            ? window.ExtensionSettings.defaultVolume
            : 0.05;
        video.volume = defVol;
        video.dataset.defaultVolumeApplied = 'true';
    }
}

window.addEventListener('play', enforceVolume, true);
window.addEventListener('canplay', enforceVolume, true);
window.addEventListener('loadedmetadata', enforceVolume, true);
window.addEventListener('durationchange', enforceVolume, true);

function processVideos() {
    const videos = document.querySelectorAll('video');
    const strategies = Object.values(window.Strategies);
    // Find which web are we on
    let strategy = strategies.find(s => s.matches() && s !== window.Strategies.Generic);
    if (!strategy) strategy = window.Strategies.Generic;

    videos.forEach(video => {
        // Apply default volume only once
        if (!video.dataset.defaultVolumeApplied) {
            const defVol = (window.ExtensionSettings && window.ExtensionSettings.defaultVolume !== undefined)
                ? window.ExtensionSettings.defaultVolume
                : 0.05;
            video.volume = defVol;
            video.dataset.defaultVolumeApplied = 'true';
        }

        const root = video.closest('[data-testid="videoComponent"]') || video.closest('.html5-video-player') || video.parentNode;

        if (strategy) {
            try {
                strategy.inject(video, root);
            } catch (e) {
                window.Strategies.Generic.inject(video, root);
            }
        }
    });
}

const observer = new MutationObserver((mutations) => {
    processVideos();
});

observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
setInterval(processVideos, 2000);

if (document.body) processVideos();
