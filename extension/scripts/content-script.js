// Get button from UI
const button = document.getElementById("clickMeExtension");

let SelectedWorkspaceId = null;

const handleMessage = (event) => {

    console.log("Incoming event received on content script");

    if (event.data.type == "MY_STATE_UPDATE") {
        console.log("Updated variable in content script")
        SelectedWorkspaceId = event.data.value;
    }
};

window.addEventListener("message", handleMessage);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request.message.tabURL);
    console.log(SelectedWorkspaceId);

    // Send message to website
    window.postMessage(
        {
            type: "MY_EXTENSION_UPDATE",
            value: {
                whatever: "hello",
            },
        },
        "*"
    );

    return;

    axios({
        method: "post",
        url: `http://localhost:3000/api/workspaces/tabs/`,
        data: {
            workspaceId: SelectedWorkspaceId,
            newTab: {
                url: request.message.tabURL,
                title: "This tab was added from the extension",
                pinned: false,
            },
        },
    })
        .then((res) => {
            refreshWorkspace(res.data.workspace);
            setSelectedWorkspace(res.data.workspace);
        })
        .catch((error) => {
            console.warn(error);
        });

    button.click();
});
