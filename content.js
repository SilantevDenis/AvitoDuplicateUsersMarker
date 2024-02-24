function initialize() {
    addCheckboxes();
    markSavedNames();
  }

// Функция для добавления чекбоксов и их инициализации
function addCheckboxes() {
    document.querySelectorAll('a[href^="/user/"]').forEach(el => {
      let href = el.getAttribute('href').split('?')[0];
      const fullHref = `https://www.avito.ru${href}`;
  
      // Создаем чекбокс, если он еще не создан
      if (!el.checkboxAdded) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginLeft = '5px';
  
        // Проверяем, сохранена ли ссылка, и устанавливаем состояние чекбокса
        chrome.runtime.sendMessage({action: "getSavedState", href: fullHref}, function(response) {
          checkbox.checked = response.isSaved;
        });
  
        // Добавляем обработчик для сохранения/удаления ссылки при изменении состояния чекбокса
        checkbox.addEventListener('click', function(event) {
          event.stopPropagation(); // Предотвращаем всплытие события
          const name = el.textContent.trim();
          if (checkbox.checked) {
            // Сохраняем ссылку, если чекбокс активирован
            chrome.runtime.sendMessage({action: "updateUser", href: fullHref, name});
          } else {
            // Удаляем ссылку, если чекбокс деактивирован (если требуется логика удаления)
            // chrome.runtime.sendMessage({action: "removeUser", href: fullHref});
          }
        });
  
        el.insertAdjacentElement('afterend', checkbox);
        el.checkboxAdded = true; // Помечаем, что чекбокс добавлен
      }
    });
  }
  

  function markSavedNames() {
    // Находим все имена на странице. Этот селектор нужно будет адаптировать под вашу структуру страницы.
    document.querySelectorAll('a[href^="/user/"]').forEach(el => {
      const name = el.textContent.trim();
  
      // Отправляем запрос в background.js для проверки, сохранено ли имя в базе
      chrome.runtime.sendMessage({action: "checkName", name: name}, function(response) {
        if (response.isSaved) {
          // Если имя найдено в базе, отмечаем его красным цветом
          el.style.color = 'red';
        }
      });
    });
  }
  

  

  // Инициализация и наблюдение за изменениями DOM
document.addEventListener('DOMContentLoaded', initialize);
new MutationObserver(initialize).observe(document.body, { childList: true, subtree: true });