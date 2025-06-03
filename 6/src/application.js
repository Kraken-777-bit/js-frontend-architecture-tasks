import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const form = document.querySelector('[data-form="sign-up"]');
  const submitButton = form.querySelector('[type="submit"]');
  const inputs = Array.from(form.elements).filter(el => el.name);

  const state = onChange({
    form: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    errors: {},
    isValid: false,
    isSending: false,
  }, (path, value, prev) => {
    if (['form.name', 'form.email', 'form.password', 'form.passwordConfirmation'].includes(path)) {
      const errors = validate(state.form);
      state.errors = errors;
      state.isValid = isEmpty(errors);
    }

    if (path === 'errors') {
      inputs.forEach((input) => {
        const { name } = input;
        const error = state.errors[name];

        if (error) {
          input.classList.add('is-invalid');
          const feedback = input.nextElementSibling;
          if (feedback) {
            feedback.textContent = error.message;
          } else {
            const div = document.createElement('div');
            div.classList.add('invalid-feedback');
            div.textContent = error.message;
            input.insertAdjacentElement('afterend', div);
          }
        } else {
          input.classList.remove('is-invalid');
          const feedback = input.nextElementSibling;
          if (feedback?.classList.contains('invalid-feedback')) {
            feedback.remove();
          }
        }
      });
    }

    if (path === 'isValid' || path === 'isSending') {
      submitButton.disabled = !state.isValid || state.isSending;
    }
  });

  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      state.form[input.name] = e.target.value;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    state.isSending = true;

    try {
      await axios.post(routes.usersPath(), state.form);
      const container = document.querySelector('[data-container="sign-up"]');
      container.textContent = 'User Created!';
    } catch (err) {
      // опционально — можно показать сообщение об ошибке сети
      console.error(errorMessages.network.error);
    }
  });
};
// END
