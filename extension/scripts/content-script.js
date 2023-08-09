// Get button from UI
// const button = document.getElementById("cliclMeExtension");

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request);
});
