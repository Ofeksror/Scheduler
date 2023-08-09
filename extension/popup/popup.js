const getTabsInWindow = async () => {
    return chrome.tabs.query({ currentWindow: true });
};

const button = document.querySelector("button");

button.addEventListener("click", async () => {
    console.log("Click!");

    // TODO Tomorrow: Find a way to send a message to my website (even if it is not the currently active tab)
    // The message would be received in the website
    // It will be used to, for example, refresh the workspace.

    // Resources:
    // https://developer.chrome.com/docs/extensions/mv3/messaging/

    // Doesn't work?
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    // window.postMessage({ value: "Hello, world!" }, "*");

    // Sends a message to service-worker
    chrome.runtime.sendMessage("TriggerFunc"); 
});
