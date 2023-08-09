// Get button from UI
const button = document.getElementById("clickMeExtension");

let SelectedWorkspaceId = null;

const handleMessage = (event) => {
    console.log("Incoming event received on content script");

    if (event.data.type == "MY_STATE_UPDATE") {
        console.log("Updated variable in content script");
        SelectedWorkspaceId = event.data.value;
    }
};

window.addEventListener("message", handleMessage);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request.message.tabURL);
    console.log(SelectedWorkspaceId);

    const newTabURL = "http://localhost:3000/api/workspaces/tabs/";

    const response = await fetch(newTabURL, {
        method: "POST",
        body: JSON.stringify({
            workspaceId: SelectedWorkspaceId,
            newTab: {
                url: request.message.tabURL,
                title: "This tab was added from the extension",
                pinned: false,
            },
        }),
    });

    console.log(response);

    const res = await response.json();
    console.log(res);

    window.postMessage(
        {
            type: "MY_EXTENSION_UPDATE",
            workspace: res.workspace,
        },
        "*"
    );

    return;

    axios({
        method: "post",
        url: ``,
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
            // Send message to website
            window.postMessage(
                {
                    type: "MY_EXTENSION_UPDATE",
                    workspace: res.data.workspace,
                },
                "*"
            );
        })
        .catch((error) => {
            console.warn(error);
        });

    button.click();
});
