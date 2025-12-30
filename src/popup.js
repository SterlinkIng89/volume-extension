document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('defaultVolume');
    const status = document.getElementById('status');

    // Load saved value
    chrome.storage.sync.get(['defaultVolume'], (result) => {
        if (result.defaultVolume !== undefined) {
            input.value = result.defaultVolume * 100;
        } else {
            input.value = 5;
        }
    });

    // Save on change
    input.addEventListener('change', () => {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            const decimalVol = val / 100;
            chrome.storage.sync.set({ defaultVolume: decimalVol }, () => {
                status.textContent = 'Saved!';
                setTimeout(() => status.textContent = '', 1500);
            });
        }
    });
});
