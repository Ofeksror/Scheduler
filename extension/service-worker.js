// Get the selectedWorkspace stored in a cookie
const getSelectedWorkspace = () => {
    return chrome.cookies.get(
        { name: "WorkspaceSelected", url: "http://localhost:3000/" },
        (cookie) => {
            return JSON.parse(decodeURIComponent(cookie.value));
        }
    );
}
