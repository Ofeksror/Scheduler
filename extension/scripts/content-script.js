setInterval(() => {
    console.log("A");
}, 1000);

window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    const message = event.data;

    if (message.type !== "MY_STATE_UPDATE") {
        return;
    }

    const value = message.value;

    console.log(`My State Value: ${value}`)

    // Message passing
    const response = await chrome.runtime.sendMessage({ workspaceId: value });
    console.log(resposne);
});
