// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key "${key}" in namespace "${namespace}" changed.`,
//             `Old value was "${oldValue}", new value is "${newValue}".`
//         );
//     }
// });

// setInterval(async () => {
//     console.log("Hey");
//     chrome.storage.local.get("SelectedWorkspace").then((result) => { console.log(result) });
// }, 1000);

setInterval(() => {
    chrome.cookies.get(
        { name: "WorkspaceSelected", url: "http://localhost:3000/" },
        (cookie) => {
            console.log(JSON.parse(decodeURIComponent(cookie.value)));
        }
    );
}, 1000);
