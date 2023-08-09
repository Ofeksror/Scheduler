// Get the selectedWorkspace stored in a cookie
// const getSelectedWorkspace = () => {
//     return chrome.cookies.get(
//         { name: "WorkspaceSelected", url: "http://localhost:3000/" },
//         (cookie) => {
//             return JSON.parse(decodeURIComponent(cookie.value));
//         }
//     );
// };

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // Receives a message from popup

    // Get relevant tab (url of localhost:3000)
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
    const [tab] = await chrome.tabs.query({ url: "http://localhost:3000/*" });

    // Send a message to content-script
    const response = await chrome.tabs.sendMessage(tab.id, {
        message: {
            tabURL: "https://excalidraw.com",
        },
    });
});
