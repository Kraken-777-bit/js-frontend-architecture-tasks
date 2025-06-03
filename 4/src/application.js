// BEGIN
export default (companies) => {
  const container = document.querySelector('.container.m-3'); // Получаем контейнер
  let activeDescription = null; // Храним текущий элемент описания

  companies.forEach(({ name, description }) => {
    const button = document.createElement('button'); // Создаем кнопку
    button.classList.add('btn', 'btn-primary', 'mr-2'); // Добавляем классы Bootstrap
    button.textContent = name; // Устанавливаем название компании

    button.addEventListener('click', () => {
      // Удаляем активное описание, если оно есть
      if (activeDescription) {
        // Если описание уже показано для этой же кнопки — скрываем
        if (activeDescription.textContent === description) {
          activeDescription.remove();
          activeDescription = null;
          return;
        }

        activeDescription.remove(); // Иначе просто удаляем старое описание
        activeDescription = null;
      }

      // Добавляем новое описание
      const desc = document.createElement('div'); // Создаем div для описания
      desc.textContent = description; // Устанавливаем текст
      container.appendChild(desc); // Добавляем в контейнер
      activeDescription = desc; // Сохраняем активное описание
    });

    container.appendChild(button); // Добавляем кнопку в DOM
  });
};
// END