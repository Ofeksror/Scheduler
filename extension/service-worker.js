// Receives messages from content script (the web-app)
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
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

            await delay(3000)
            const openedTabs = await chrome.tabs.query({ pinned: false });
            messageContentScript({
                event: "EXT_TABS_OPENED",
                openedTabs
            });

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

            const tabs = queriedTabs.map((tab) => {
                return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                };
            });

            messageContentScript({
                event: "EXT_TABS_REQUEST",
                workspaceId: request.workspaceId,
                workspaceTitle: request.workspaceTitle,
                workspaceResources: request.workspaceResources,
                switchingWorkspace: request.switchingWorkspace,
                tabs,
            });

            break;
        }
        case "WEB_WORKSPACE_NEW": {
            const queriedTabs = await chrome.tabs.query({ pinned: false });
            const tabs = queriedTabs.map((tab) => {
                return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                };
            });

            messageContentScript({
                event: "EXT_WORKSPACE_NEW",
                workspaceTitle: request.workspaceTitle,
                tabs,
            });
        }
        case "WEB_TAB_CLOSE": {
            if (request.tabsIds) {
                await chrome.tabs.remove(request.tabsIds);
            }

            break;
        }
        case "WEB_RESOURCE_OPEN": {
            await chrome.tabs.create({
                url: request.resourceUrl,
                active: true
            });

            break;
        }
        case "WEB_WORKSPACE_CLOSE": {
            const queriedTabs = await chrome.tabs.query({ pinned: false });
            const tabsToClose = queriedTabs.map((tab) => tab.id);
            const tabs = queriedTabs.map((tab) => {
                return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                };
            });

            // Close tabs
            await chrome.tabs.remove(tabsToClose);

            messageContentScript({
                event: "EXT_WORKSPACE_CLOSE",
                tabs
            });
        }
        default:
            break;
    }
});

const messageContentScript = async (message) => {
    const managerTabId = await getManager();

    try {
        await chrome.tabs.sendMessage(managerTabId, message);
    }
    catch (error) {
        await injectContentScript(managerTabId)
        await chrome.tabs.sendMessage(managerTabId, message);
    }
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ===

const injectContentScript = async (managerTabId) => {
    chrome.scripting.executeScript(
        {
            files: ["scripts/content-script.js"],
            injectImmediately: true,
            target: {
                tabId: managerTabId
            }
        },
        (results) => {
            console.log(results);
        }
    )
}

const getManager = async () => {
    const tabsQueried = await chrome.tabs.query({
        url: "https://tab-manager.ofeksror.com/*",
    });

    if (tabsQueried.length == 0) {
        const managerTabId = await chrome.tabs.create(
            {
                index: 0,
                active: false,
                pinned: true,
                url: "https://tab-manager.ofeksror.com/",
            },
            (tab) => tab.id
        );

        return managerTabId;
    }

    return tabsQueried[0].id;

};

const getInitialIndex = async () => {
    const pinnedTabs = await chrome.tabs.query({ pinned: true });
    return pinnedTabs.length;
};


chrome.tabs.onCreated.addListener(async (tab) => {
    if (tab.pinned) return;

    const initialIndex = await getInitialIndex();

    await messageContentScript({
        event: "EXT_TAB_CREATED",
        tab: {
            url: tab.url,
            id: tab.id,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
            index: tab.index - initialIndex,
        },
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log(tab);

    // Changes to ignore
    if (tab.pinned && !("pinned" in changeInfo)) {
        return;
    }

    const initialIndex = await getInitialIndex();

    if (changeInfo.hasOwnProperty("favIconUrl") || changeInfo.hasOwnProperty("title") || changeInfo.hasOwnProperty("url")) {
        await messageContentScript({
            event: "EXT_TAB_UPDATED",
            tab: {
                ...tab,
                index: tab.index - initialIndex
            }
        })
    }
    else if ("pinned" in changeInfo) {
        const tabs = await chrome.tabs.query({ pinned: false });

        await messageContentScript({
            event: "EXT_TAB_PINNED",
            tabs: tabs,
        });
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    // Check if the whole window was closed
    if (removeInfo.isWindowClosing) {
        // Ignore
        return;
    }

    await messageContentScript({
        event: "EXT_TAB_REMOVED",
        tabId: tabId,
    });
});

chrome.tabs.onMoved.addListener(async (tabId, moveInfo) => {
    // // Check moved tab was pinned
    // const movedTab = await chrome.tabs.query({id: tabId});
    // if (movedTab.pinned)
    //     return;

    // const initialIndex = await getInitialIndex();

    // const adjustedMoveInfo = {
    //     fromIndex: moveInfo.fromIndex - initialIndex,
    //     toIndex: moveInfo.toIndex - initialIndex,
    // };

    // await messageContentScript({
    //     event: "EXT_TAB_MOVED",
    //     moveInfo: adjustedMoveInfo,
    // });

    const tabs = await chrome.tabs.query({ pinned: false });

    await messageContentScript({
        event: "EXT_TAB_MOVED",
        tabs: tabs,
    });
});