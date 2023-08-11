// let SelectedWorkspaceId = null;

window.addEventListener("message", ({ data: message }) => {
    // if (event.data.type == "MY_STATE_UPDATE") {
    //     SelectedWorkspaceId = event.data.value;
    // }
    switch (message.event) {
        case "WEB_WORKSPACE_CHANGED": {
            chrome.runtime.sendMessage(message);
            break;
        }
        case "WEB_TABS_DELETED": {
            chrome.runtime.sendMessage(message);
            break;
        }
        default: break
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    window.postMessage(request);
    return;
});