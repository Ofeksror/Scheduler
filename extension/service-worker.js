let ignoreEvents = false;

let createdTabsIds = [];

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // Receives messages from content script
    console.log(request);
    switch (request.event) {
        case "WEB_WORKSPACE_CHANGED": {
            // Close previous tabs
            const queriedTabs = await chrome.tabs.query({});
            const previousTabs = queriedTabs.filter(
                (tab) => tab.url != "http://localhost:3000/"
            );
            const previousTabsIds = previousTabs.map((tab) => tab.id);

            chrome.tabs.remove(previousTabsIds);

            // Open new tabs
            // await request.tabs.forEach(async (tab, index) => {
            //     await chrome.tabs.create({
            //         index,
            //         active:  false,
            //         pinned: tab.pinned,
            //         url: tab.url
            //     }, (tab) => {
            //         tabsCreated.push(tab.id);
            //     })
            // });

            const { id: managerId } = await getManager();
            console.log(managerId);

            for (let i = 0; i < request.tabs.length; i++) {
                await chrome.tabs.create(
                    {
                        index: i,
                        active: false,
                        pinned: request.tabs[i].pinned,
                        url: request.tabs[i].url,
                        openerTabId: managerId,
                    },
                    (tab) => {
                        createdTabsIds.push(tab.id);
                    }
                );
            }

            break;
        }
        case "WEB_TABS_DELETED": {
            ignoreEvents = true;

            const tabsBrowserIds = request.tabs.map((tab) => tab.browserTabId);
            await chrome.tabs.remove(tabsBrowserIds);

            ignoreEvents = false;
            break;
        }
        default:
            break;
    }
});

const messageContentScript = async (message) => {
    const managerTab = await openManager();

    await chrome.tabs.sendMessage(managerTab.id, message);
};

// ===

const openManager = async () => {
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

// ===

chrome.tabs.onCreated.addListener(async (tab) => {
    // if (createdTabsIds.length !== 0) {
    //     const index = createdTabsIds.indexOf(tab.id);
    //     if (index != -1) {
    //         createdTabsIds.splice(0, index);
    //         console.log(createdTabsIds);
    //         return;
    //     }
    // }

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
    // const { id: managerId } = await getManager();
    // if (tab.openerTabId == managerId) {
    //     console.log("opened by manager tab");
    //     return;
    // }

    if (changeInfo.status && changeInfo.status == "complete") {
        await messageContentScript({
            event: "EXT_TAB_UPDATED",
            tab: tab,
        });
    } else if ("pinned" in changeInfo) {
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
