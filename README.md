A tab manager tool, inspired by the popular chrome extension "Workona".

## Video Demonstration

The project is not hosted online, but you can watch a demonstration of most of its features here!
[![Watch the Demo!](https://img.youtube.com/vi/Rp7TStr8Lwk/hqdefault.jpg)](https://www.youtube.com/watch?v=Rp7TStr8Lwk)

## Introduction to the Project

In this project I built an interface that allows users to organize tabs and bookmarks into 'workspaces', which are essentially spaces dedicated for different projects or focus areas.<br>
The tabs are the active tabs that were open in your last browsing session, and the bookmarks are unique to the workspace, and enable you to save any link you want to have quick access to. Everything is synced to the cloud, so to allow seamless usage of the tab manager utility even across devices.
<br>
Users are able to open, close, and switch between workspaces. <br>
When switching to another workspace, the tabs that were previously opened are closed and saved to the cloud under the previous workspace that was open. Then, the tabs saved under the new workspace we're switching to are opened, restoring your browsing session from exactly where you left it last time.

---

## Custom Messaging System

Through the website the user can switch between the workspaces, but since a website by itself cannot control the tabs opened in your browser, I had to think of a way to enable the desired functionality.<br>
I ended up developing a web application that is the interface the user engages with, and a chrome extension utility that would execute the operations the user requests. <br>
That required me to develop a **custom messaging system** between the web application and chrome extension. <br>
<br>
Here is an example scenario that will help you understand how that custom messagin system works, switching between workspaces: When the user opens a different workspace, we want the tabs of the new workspace to open instead of the tabs that are open right now. The website sends a message to the chrome extension notifying it of a workspace switch event, and some data - the tab URLs we need to open. The chrome extension receives that message, and closes all open tabs (that belong to the previous workspace), and after that it opens each one of the URLs it was provided. Now all that's left to do is displaying the open tabs in the website, so the chrome extension waits that all the new tabs are finally loaded and then sends the website a message that contains each tab's title and favicon. 
