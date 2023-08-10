// let SelectedWorkspaceId = null;

window.addEventListener("message", (event) => {
    // if (event.data.type == "MY_STATE_UPDATE") {
    //     SelectedWorkspaceId = event.data.value;
    // }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    window.postMessage(request);
    return;
});

setInterval(async () => {
    chrome.runtime.sendMessage("content script sent this");
}, 1000)