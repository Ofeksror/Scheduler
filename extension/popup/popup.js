const getTabsInWindow = async () => {
    return chrome.tabs.query({ currentWindow: true });
};

const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//     const tabs = await getTabsInWindow();
//     console.log(tabs);
// });

button.addEventListener("click", async () => {
    chrome.runtime.sendMessage({});
    console.log("Message sent!");
});
