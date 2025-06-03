// BEGIN
export default function app () {
  const form = document.querySelector('form'); // Получаем форму со страницы
  const input = form.elements.number; // Получаем поле ввода с именем "number"
  const result = document.getElementById('result'); // Получаем блок, где отображается результат
  const resetButton = form.querySelector('button'); // Получаем кнопку сброса

  let sum = 0; // Переменная для хранения суммы

  // Функция для обновления интерфейса
  const render = () => {
    result.textContent = sum; // Отображаем текущую сумму
    form.reset(); // Очищаем форму (сброс поля ввода)
    input.focus(); // Ставим фокус обратно на поле ввода
  };

  // Обработчик события отправки формы (кнопка "plus")
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Отменяем стандартную отправку формы

    const value = parseInt(input.value, 10); // Преобразуем введённое значение в число
    if (!Number.isNaN(value)) {
      sum += value; // Если число валидное — добавляем к сумме
    }

    render(); // Обновляем интерфейс
  });

  // Обработчик события нажатия на кнопку "reset"
  resetButton.addEventListener('click', () => {
    sum = 0; // Сбрасываем сумму в 0
    render(); // Обновляем интерфейс
  });

  render(); // Первый вызов render — устанавливаем начальное состояние при загрузке
};
// END