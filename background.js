chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ users: {} }); // Инициализируем хранилище локально
  });
  
  // Функция для проверки и обновления данных пользователей
  function updateUser(href, name, callback) {
    chrome.storage.local.get(['users'], function(result) {
      let users = result.users || {};
      let exists = users[href];
      let status = exists ? "exists" : "new";
      if (status === "new") {
        users[href] = name;
        chrome.storage.local.set({ users });
      }
      callback(status);
    });
  }
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "updateUser") {
        updateUser(request.href, request.name, sendResponse);
        return true; // для асинхронного ответа
      }
    }
  );
  