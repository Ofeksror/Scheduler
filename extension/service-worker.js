let ignoreEvents = false;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // Receives messages from content script
    console.log(request);
    switch (request.event) {
        case "WEB_WORKSPACE_CHANGED": {
            ignoreEvents = true;

            // Close previous tabs
            const queriedTabs = await chrome.tabs.query({});
            const previousTabs = queriedTabs.filter((tab) => tab.url != "http://localhost:3000/");
            const previousTabsIds = previousTabs.map((tab) => tab.id);

            chrome.tabs.remove(previousTabsIds)
            
            // Open new tabs
            request.tabs.forEach((tab, index) => {
                chrome.tabs.create({
                    index,
                    active: false,
                    pinned: tab.pinned,
                    url: tab.url
                })
            });

            ignoreEvents = false;
            break;
        }
        default: break
    }
});

const messageContentScript = async (message) => {
    if (ignoreEvents) {
        return;
    }

    const managerTab = await openManager();
    console.log(managerTab);

    await chrome.tabs.sendMessage(managerTab.id, message);
};

// ===

const openManager = async () => {
    const tabsQueried = await chrome.tabs.query({url: "http://localhost:3000/"});

    if (tabsQueried.length != 0) {
        return tabsQueried[0];
    }

    const managerTab = await chrome.tabs.create({
        index: 0,
        active: false,
        pinned: true,
        url: "http://localhost:3000/"
    }, (tab) => tab);

    return managerTab;
}

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

    // Check if the tab closed is the tab manager
    if (removeInfo.url == "http://localhost:300/") {
        console.log("User tried to close tab manager.");
        openManager();
        return;
    }

    await messageContentScript({
        event: "EXT_TAB_REMOVED",
        browserTabId: browserTabId,
    });
});
