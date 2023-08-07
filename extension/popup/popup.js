const getTabsInWindow = async () => {
    return chrome.tabs.query({ currentWindow: true });
};

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    const tabs = await getTabsInWindow();
    console.log(tabs);
});
