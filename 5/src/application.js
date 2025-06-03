import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default () => {
  const listsContainer = document.querySelector('[data-container="lists"]'); // Контейнер списков
  const tasksContainer = document.querySelector('[data-container="tasks"]'); // Контейнер задач
  const newListForm = document.querySelector('[data-container="new-list-form"]'); // Форма создания списка
  const newTaskForm = document.querySelector('[data-container="new-task-form"]'); // Форма создания задачи

  const lists = {}; // Хранилище списков (ключ — id, значение — { name, tasks: [] })
  const names = new Set(); // Для отслеживания уникальности названий списков

  const renderLists = () => {
    const ul = document.createElement('ul');
    Object.entries(lists).forEach(([id, { name }]) => {
      const li = document.createElement('li');
      if (id === currentListId) {
        const b = document.createElement('b');
        b.textContent = name;
        li.appendChild(b);
      } else {
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = name;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          currentListId = id;
          render();
        });
        li.appendChild(a);
      }
      ul.appendChild(li);
    });
    listsContainer.innerHTML = '';
    listsContainer.appendChild(ul);
  };

  const renderTasks = () => {
    const currentTasks = lists[currentListId].tasks;
    tasksContainer.innerHTML = ''; // очищаем контейнер

    if (currentTasks.length === 0) {
      return; // если задач нет — ничего не добавляем
    }

    const ul = document.createElement('ul');
    currentTasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = task;
        ul.appendChild(li);
    });
    tasksContainer.appendChild(ul); // добавляем список только если есть задачи
  };

  const render = () => {
    renderLists();
    renderTasks();
  };

  // Начальное состояние
  const generalId = uniqueId('general_');
  lists[generalId] = { name: 'General', tasks: [] };
  names.add('General');
  let currentListId = generalId;
  render();

  // Обработка добавления списка
  newListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.elements.name;
    const name = input.value.trim();
    if (names.has(name)) {
      input.value = '';
      return;
    }
    const id = uniqueId(`${name.toLowerCase()}_`);
    lists[id] = { name, tasks: [] };
    names.add(name);
    input.value = '';
    render();
  });

  // Обработка добавления задачи
  newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.elements.name;
    const task = input.value.trim();
    if (task !== '') {
      lists[currentListId].tasks.push(task);
      input.value = '';
      renderTasks();
    }
  });
};
// END
