window.VolumeUtils = {
    createVolumeInput: function (video, isGeneric = false, forceDefaultVolume = true) {
        if (forceDefaultVolume && !video.dataset.defaultVolumeApplied) {
            const defVol = (window.ExtensionSettings && window.ExtensionSettings.defaultVolume !== undefined)
                ? window.ExtensionSettings.defaultVolume
                : 0.05;
            video.volume = defVol;
            video.dataset.defaultVolumeApplied = 'true';
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'volume-control-container';
        if (isGeneric) wrapper.classList.add('volume-control-generic');

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '100';
        input.value = Math.round(video.volume * 100);
        input.className = 'volume-control-input';

        const stop = (e) => e.stopPropagation();

        input.addEventListener('input', (e) => {
            stop(e);
            let val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                const newVolume = Math.min(Math.max(val / 100, 0), 1);
                video.volume = newVolume;
                video.muted = (newVolume === 0);
            }
        });

        ['click', 'keydown', 'mousedown', 'mouseup', 'keyup'].forEach(evt =>
            input.addEventListener(evt, stop)
        );

        video.addEventListener('volumechange', () => {
            if (document.contains(input)) {
                input.value = Math.round(video.volume * 100);
            }
        });

        wrapper.appendChild(input);
        return wrapper;
    }
};
