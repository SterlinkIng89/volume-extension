window.Strategies = window.Strategies || {};
window.Strategies.Twitter = {
    matches: () => window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com'),

    inject: (video, root) => {
        if (root.querySelector('.volume-control-container')) return;

        const timeElement = window.DomUtils.findTwitterTimeElement(root);

        if (timeElement) {
            let current = timeElement;
            let found = false;
            let iterations = 0;
            while (current && current !== root && iterations < 10) {
                if (current.parentNode) {
                    for (const sib of current.parentNode.children) {
                        if (sib !== current && window.DomUtils.isMuteButton(sib)) {
                            const wrapper = window.VolumeUtils.createVolumeInput(video, false, true);
                            window.DomUtils.injectAfter(video, current, wrapper);
                            found = true;
                            break;
                        }
                    }
                }
                if (found) break;
                current = current.parentNode;
                iterations++;
            }
            if (found) return;
        }

        // Fallback
        const selector = 'button[aria-label="Silenciar"], button[aria-label="Mute"], button[aria-label="Unmute"], button[aria-label="Anular silencio"], button[aria-label="Activar sonido"]';
        const muteBtn = root.querySelector(selector);
        if (muteBtn) {
            const volWrapper = muteBtn.parentNode;
            if (volWrapper && volWrapper.parentNode) {
                const wrapper = window.VolumeUtils.createVolumeInput(video, false, true);
                window.DomUtils.injectBefore(video, volWrapper.parentNode, volWrapper, wrapper);
            }
        }
    }
};
