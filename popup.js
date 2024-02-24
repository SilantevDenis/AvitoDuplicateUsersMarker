document.addEventListener('DOMContentLoaded', function() {
    const linksList = document.getElementById('linksList');

    // Загрузка и отображение сохранённых данных из локального хранилища
    chrome.storage.local.get(['users'], function(result) {
        if (result.users) {
            Object.entries(result.users).forEach(([href, name]) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${href}" target="_blank">${name}</a>`;
                linksList.appendChild(listItem);
            });
        }
    });
});
