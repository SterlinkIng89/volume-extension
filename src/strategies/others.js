window.Strategies = window.Strategies || {};

window.Strategies.Steam = {
    // Steam is not working right now

    matches: () => window.location.hostname.includes('steampowered.com') || window.location.hostname.includes('steamcommunity.com'),

    inject: (video, root) => {
        const container = video.closest('.highlight_player_item') || video.parentNode;
        if (!container) return;

        if (container.querySelector('.volume-control-container')) return;


        let controlBar = container.querySelector('.video_controls_bar') || container.querySelector('.html5_video_controls');



        if (!controlBar) {
            const svgs = container.querySelectorAll('svg');
            for (const svg of svgs) {
                // Heuristic: The volume icon usually has this path or class
                if (svg.classList.contains('SVGIcon_Button') || svg.querySelector('path[d^="M31.3137"]')) {

                    let btnWrapper = svg.closest('.tool-tip-source') || svg.parentNode;

                    if (btnWrapper && btnWrapper.parentNode) {
                        const wrapper = window.VolumeUtils.createVolumeInput(video, false, true);
                        window.DomUtils.injectAfter(video, btnWrapper, wrapper);
                        return;
                    }
                }
            }
        }

        if (controlBar) {
            const volSlider = controlBar.querySelector('.volume_icon') || controlBar.querySelector('.clarity_volume_slider');
            const wrapper = window.VolumeUtils.createVolumeInput(video, false, true);

            if (volSlider) {
                window.DomUtils.injectAfter(video, volSlider, wrapper);
                return;
            }
            controlBar.appendChild(wrapper);
            return;
        }

        window.Strategies.Generic.inject(video, root);
    }
};

// Generic fallback
window.Strategies.Generic = {
    matches: () => true,

    inject: (video, root) => {
        if (video.parentNode.querySelector('.volume-control-container')) return;

        const wrapper = window.VolumeUtils.createVolumeInput(video, true, true);
        const parent = video.parentNode;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        parent.appendChild(wrapper);
    }
};
