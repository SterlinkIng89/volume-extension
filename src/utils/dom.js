window.DomUtils = {
    isMuteButton: function (node) {
        const selector = 'button[aria-label="Silenciar"], button[aria-label="Mute"], button[aria-label="Unmute"], button[aria-label="Anular silencio"], button[aria-label="Activar sonido"]';
        return node.matches && (node.matches(selector) || node.querySelector(selector));
    },

    findTwitterTimeElement: function (root) {
        const allElements = root.querySelectorAll('div, span');
        for (const el of allElements) {
            if (/^\d+:\d+\s\/\s\d+:\d+$/.test(el.textContent) || /^\d+:\d+$/.test(el.textContent)) {
                return el;
            }
        }
        return null;
    },

    injectAfter: function (video, referenceNode, wrapper) {
        if (referenceNode.nextSibling && referenceNode.nextSibling.classList && referenceNode.nextSibling.classList.contains('volume-control-container')) return;
        if (referenceNode.nextSibling) {
            referenceNode.parentNode.insertBefore(wrapper, referenceNode.nextSibling);
        } else {
            referenceNode.parentNode.appendChild(wrapper);
        }
    },

    injectBefore: function (video, container, referenceNode, wrapper) {
        container.insertBefore(wrapper, referenceNode);
    }
};
