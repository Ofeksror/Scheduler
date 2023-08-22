// let SelectedWorkspaceId = null;

const acceptedEvents = [
    "WEB_WORKSPACE_CHANGED",
    "WEB_TABS_DELETED",
    "WEB_TAB_ACTIVATE",
    "WEB_TABS_REQUEST",
    "WEB_WORKSPACE_NEW",
    "WEB_TAB_CLOSE",
    "WEB_RESOURCE_OPEN",
    "WEB_WORKSPACE_CLOSE"
]

window.addEventListener("message", ({ data: message }) => {
    if (acceptedEvents.includes(message.event)) {
        chrome.runtime.sendMessage(message);
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    window.postMessage(request);
    return;
});
