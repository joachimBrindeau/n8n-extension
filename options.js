document.getElementById('save_button').addEventListener('click', function() {
  const apiUrl = document.getElementById('api_url').value;
  const apiKey = document.getElementById('api_key').value;
  
  chrome.storage.sync.set({apiUrl, apiKey}, function() {
    chrome.browserAction.setPopup({popup: "popup.html"}, function() {
      window.close();
    });
  });
});