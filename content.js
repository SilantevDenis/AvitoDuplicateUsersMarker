function processUsers() {
    document.querySelectorAll('a').forEach((el) => {
      let href = el.getAttribute('href');
      if (href && href.startsWith('/user/')) {
        // Проверяем, не добавлена ли уже галочка, чтобы избежать дублирования
        if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('save-user-checkbox')) {
          // Создаём чекбокс
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.classList.add('save-user-checkbox'); // Класс для стилизации, если нужно
          checkbox.style.marginLeft = '5px'; // Добавляем небольшой отступ
  
          // Добавляем обработчик события на чекбокс
          checkbox.addEventListener('change', function() {
            if (this.checked) {
              const name = el.textContent.trim();
              const cleanHref = href.split('?')[0]; // Очищаем URL от параметров запроса
              const fullHref = `https://www.avito.ru${cleanHref}`;
  
              // Отправляем данные в фоновый скрипт для сохранения
              chrome.runtime.sendMessage({action: "updateUser", href: fullHref, name}, function(response) {
                if (response === "exists") {
                  el.style.color = 'red'; // Помечаем имя красным, если уже существует
                }
              });
            }
          });
  
          // Вставляем чекбокс после ссылки
          el.parentNode.insertBefore(checkbox, el.nextSibling);
        }
      }
    });
  }
  
  // Вызываем функцию при загрузке страницы и при каждом изменении DOM
  processUsers();
  new MutationObserver(processUsers).observe(document.body, { childList: true, subtree: true });
  