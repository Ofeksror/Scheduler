const getTabsInWindow = async () => {
    return chrome.tabs.query({ currentWindow: true });
};

const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//     const tabs = await getTabsInWindow();
//     console.log(tabs);
// });

button.addEventListener("click", async () => {
    chrome.runtime.sendMessage({ action: "triggerFunction" });
    console.log("Message sent!");
});

// setInterval(async () => {
//     console.log("Hey");
//     const selectedWorkspace = JSON.parse(
//         localStorage.getItem("SelectedWorkspace")
//     );
//     console.log(selectedWorkspace);

//     chrome.storage.local.get(["SelectedWorkspace"]).then((result) => {
//         console.log(result);
//     })
// }, 1000);
