import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
export default async function app() {
  const form = document.forms[0]; // Получаем первую форму на странице
  const input = form.elements.name; // Получаем поле ввода с именем "name"
  const tasksList = document.getElementById('tasks'); // Получаем список задач (ul)

  // Функция для добавления задачи в DOM
  const renderTask = (taskName) => {
    const li = document.createElement('li'); // Создаём элемент <li>
    li.className = 'list-group-item'; // Применяем Bootstrap стиль
    li.textContent = taskName; // Устанавливаем текст задачи
    tasksList.prepend(li); // Добавляем элемент в начало списка
  };

  try {
    // Загружаем уже добавленные задачи с сервера
    const response = await axios.get(routes.tasksPath()); // Отправляем GET-запрос
    const tasks = response.data.items; // Извлекаем массив задач из ответа сервера

    tasks.slice().reverse().forEach(({ name }) => renderTask(name)); // Добавляем каждую задачу в DOM
  } catch (err) {
    console.error('Ошибка при загрузке задач:', err); // Выводим ошибку в консоль
  }

  // Обработка отправки формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Отменяем стандартную отправку формы

    const taskName = input.value.trim(); // Получаем введённый текст и удаляем пробелы

    if (taskName === '') return; // Если поле пустое — не отправляем

    try {
      const response = await axios.post(routes.tasksPath(), { name: taskName }); // Отправляем задачу на сервер

      if (response.status === 201) { // Проверяем успешный ответ от сервера
        renderTask(taskName); // Отображаем задачу в DOM
        form.reset(); // Очищаем поле ввода
        input.focus(); // Ставим курсор обратно в поле
      }
    } catch (err) {
      console.error('Ошибка при добавлении задачи:', err); // Выводим ошибку в консоль
    }
  });

  input.focus(); // Ставим фокус на поле ввода при загрузке страницы
};
// END