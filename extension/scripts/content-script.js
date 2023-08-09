// Get button from UI
const button = document.getElementById("clickMeExtension");

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request);
    button.click();
});
