function triggerFunctionOnPage() {
    // Send a message that the page script will listen for
    window.postMessage({ type: "TRIGGER_MYFUNC" }, "*");
  }
  
  // Listen for messages from the background script or popup script of your extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'triggerFunction') {
      triggerFunctionOnPage();
    }
  });