// BEGIN
export default function app(notebooks) {
  const form = document.querySelector('form'); // Получаем форму
  const result = document.querySelector('.result'); // Получаем контейнер для вывода результата

  // Функция рендеринга списка моделей ноутбуков
  const render = (items) => {
    result.innerHTML = ''; // Очищаем контейнер перед новой отрисовкой

    if (items.length === 0) return; // Если нет подходящих ноутбуков — ничего не выводим

    const ul = document.createElement('ul'); // Создаем элемент списка
    items.forEach(({ model }) => {
      const li = document.createElement('li'); // Создаем элемент списка
      li.textContent = model; // Устанавливаем текст — название модели
      ul.appendChild(li); // Добавляем в список
    });

    result.appendChild(ul); // Добавляем список в контейнер
  };

  // Функция фильтрации ноутбуков
  const applyFilters = () => {
    const formData = new FormData(form); // Получаем данные формы
    const filters = Object.fromEntries(formData.entries()); // Преобразуем в объект

    const filtered = notebooks.filter((laptop) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === '') return true; // Если фильтр пустой — пропускаем

        if (key === 'frequency_gte') return laptop.frequency >= Number(value); // Минимальная частота
        if (key === 'frequency_lte') return laptop.frequency <= Number(value); // Максимальная частота

        const field = key.replace('_eq', ''); // Получаем имя поля (например, memory или processor)
        return String(laptop[field]) === value; // Сравниваем как строки
      });
    });

    render(filtered); // Отрисовываем отфильтрованные ноутбуки
  };

  form.addEventListener('input', applyFilters); // Обрабатываем ввод в input-полях
  form.addEventListener('change', applyFilters); // Обрабатываем изменение select-полей

  render(notebooks); // Отображаем все ноутбуки при инициализации
};
// END