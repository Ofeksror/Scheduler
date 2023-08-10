chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // Receives messages from content script
    console.log(request);
});

const messageContentScript = async (message) => {
    const [managerTab] = await chrome.tabs.query({
        url: "http://localhost:3000/",
    });

    await chrome.tabs.sendMessage(managerTab.id, message);
};

// ===

chrome.tabs.onCreated.addListener(async (tab) => {
    await messageContentScript({
        event: "EXT_TAB_CREATED",
        tab: {
            title: tab.title,
            url: tab.url,
            pinned: tab.pinned,
            browserTabId: tab.id,
            faviconUrl: tab.faviconUrl,
            index: tab.index,
        },
    });
});

chrome.tabs.onUpdated.addListener(async (browserTabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status == "complete") {
        await messageContentScript({
            event: "EXT_TAB_UPDATED",
            tab: tab,
        });
    } else if ('pinned' in changeInfo) {
        await messageContentScript({
            event: "EXT_TAB_PINNED",
            tab: tab,
        });
    }
});

chrome.tabs.onMoved.addListener(async (browserTabId, moveInfo) => {
    await messageContentScript({
        event: "EXT_TAB_MOVED",
        moveInfo: moveInfo,
    });
});

chrome.tabs.onRemoved.addListener(async (browserTabId, removeInfo) => {
    // Check if the whole window was closed
    if (removeInfo.isWindowClosing) {
        // Ignore
        return;
    }

    await messageContentScript({
        event: "EXT_TAB_REMOVED",
        browserTabId: browserTabId,
    });
});
