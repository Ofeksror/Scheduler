const getTabsInWindow = async () => {
    return chrome.tabs.query({ currentWindow: true });
};

const button = document.querySelector("button");

button.addEventListener("click", async () => {
    // Sends a message to service-worker
    chrome.runtime.sendMessage({
        event: "EXT_BUTTON_PRESS"
    }); 
});
