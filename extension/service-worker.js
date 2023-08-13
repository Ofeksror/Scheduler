chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // Receives messages from content script
    console.log(request);

    switch (request.event) {
        case "WEB_WORKSPACE_CHANGED": {
            // Close previous tabs except pinned tabs
            const previousTabs = await chrome.tabs.query({ pinned: false });
            const previousTabsIds = previousTabs.map((tab) => tab.id);

            await chrome.tabs.remove(previousTabsIds);

            for (const url of request.tabsUrls) {
                await delay(100);
                await chrome.tabs.create({ url, active: false });
            }

            break;
        }
        case "WEB_TABS_DELETED": {
            const tabsIds = request.tabs.map((tab) => tab.id);
            await chrome.tabs.remove(tabsIds);

            break;
        }
        case "WEB_TAB_ACTIVATE": {
            chrome.tabs.update(request.tab.id, { active: true });

            break;
        }
        case "WEB_TABS_REQUEST": {
            const queriedTabs = await chrome.tabs.query({ pinned: false });
            console.log(queriedTabs);

            const initialIndex = await getInitialIndex();

            const tabs = queriedTabs.map((tab) => {
                return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    faviconUrl: tab.faviconUrl,
                };
            });

            const indexes = queriedTabs.map((tab) => tab.index);
            console.log(indexes);

            messageContentScript({
                event: "EXT_TABS_REQUEST",
                tabs,
            });

            break;
        }
        default:
            break;
    }
});

const messageContentScript = async (message) => {
    const managerTab = await getManager();

    await chrome.tabs.sendMessage(managerTab.id, message);
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ===

const getManager = async () => {
    const tabsQueried = await chrome.tabs.query({
        url: "http://localhost:3000/",
    });

    if (tabsQueried.length != 0) {
        return tabsQueried[0];
    }

    const managerTab = await chrome.tabs.create(
        {
            index: 0,
            active: false,
            pinned: true,
            url: "http://localhost:3000/",
        },
        (tab) => tab
    );

    return managerTab;
};

const getInitialIndex = async () => {
    const pinnedTabs = await chrome.tabs.query({ pinned: true });
    return pinnedTabs.length;
};

// P P P n n n
// 0 1 2 3 4 5
// 3

// ===

chrome.tabs.onCreated.addListener(async (tab) => {
    if (tab.pinned) return;

    const initialIndex = await getInitialIndex();

    await messageContentScript({
        event: "EXT_TAB_CREATED",
        tab: {
            url: tab.url,
            id: tab.id,
            title: tab.title,
            faviconUrl: tab.faviconUrl,
            index: tab.index - initialIndex,
        },
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Changes to ignore
    if (tab.pinned) {
        return;
    }

    const initialIndex = await getInitialIndex();

    if (changeInfo.status && changeInfo.status == "complete") {
        await messageContentScript({
            event: "EXT_TAB_UPDATED",
            tab: {
                ...tab,
                index: tab.index - initialIndex,
            },
        });
    } else if ("pinned" in changeInfo) {
        await messageContentScript({
            event: "EXT_TAB_PINNED",
            tab: tab,
        });
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    // Check if the whole window was closed
    if (removeInfo.isWindowClosing) {
        // Ignore
        return;
    }

    // Check if the tab closed is the tab manager
    if (removeInfo.url == "http://localhost:300/") {
        console.log("User tried to close tab manager.");
        getManager();
        return;
    }

    await messageContentScript({
        event: "EXT_TAB_REMOVED",
        tabId: tabId,
    });
});

chrome.tabs.onMoved.addListener(async (browserTabId, moveInfo) => {
    const initialIndex = await getInitialIndex();

    const adjustedMoveInfo = {
        fromIndex: moveInfo.fromIndex - initialIndex,
        toIndex: moveInfo.toIndex - initialIndex,
    };

    await messageContentScript({
        event: "EXT_TAB_MOVED",
        moveInfo: adjustedMoveInfo,
    });
});
