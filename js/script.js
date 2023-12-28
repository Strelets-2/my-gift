const API_URL = 'https://imminent-midnight-glasses.glitch.me/'; // адрес сервера на glitch

// Подключаем свайперы 

// Нижний свайпер
const swiperThumb = new Swiper('.gift__swiper--thumb', {
  // Optional parameters
  // Количество отображаемых карточек
  slidesPerView: "auto",
  // Прописываем расстояние между карточками в слайдере
  spaceBetween: 12,
  freeMode: true,
  breackpoints: {
    320: {
      spaceBetween: 12,
    },
    981: {
      spaceBetween: 16,
    },
  }
});

// верхний свайпер
const swiperMain = new Swiper('.gift__swiper--card', {
  // Optional parameters
  // Прописываем расстояние между карточками в слайдере
  spaceBetween: 16,

  // Количество отображаемых карточек
  slidesPerView: 1,

  // Свайпер для нижних карточек (когда кликаем на нижнюю карточку она появляется в верху)
  thumbs: {
    swiper: swiperThumb,
  },
});

const form = document.querySelector('.form');

const submitButton = form.querySelector('.form__button');
// Оформляем с помощью библиотеки IMask (подключеной в HTML файле) инпуты для телефона
const phoneInputs = form.querySelectorAll('.form__field--phone');

const cardInput = form.querySelector('.form__card');

const updateCardInput = () => {
  // Находим активный слайд
  const activeSlide = document.querySelector('.gift__swiper--card .swiper-slide-active');
  // Находим внутри активного слайда картинку и находим у неё значение data атрибута
  const cardData = activeSlide.querySelector('.gift__card-image').dataset.card;
  // Записываем его в инпут
  cardInput.value = cardData;
}
updateCardInput();

// Вызываем у основного свайпера метод (см. документацию) slideChangeTransitionEnd который запускает функцию updateCardInput после анимации другого слайда (следующего или предыдущего).
swiperMain.on('slideChangeTransitionEnd', updateCardInput);

phoneInputs.forEach(element => {
  IMask(element, {
    mask: "+{7}(000)000-00-00"
  });
});

// Создаем функцию, которая будет проверять заполнены ли все поля формы. Если какоето поле не заполнено кнопка ОТПРАВИТЬ будет не активной
const updateSubmitButton = () => {
  let isFormField = true;
  for (const field of form.elements) {
    if (field.classList.contains('form__field')) {
      // Добаавляя trim() убираем пробелы, иначе при наборе пробела поле будет считаться заполненым;
      if (!field.value.trim()) {
        isFormField = false;
        // Если в текущем поле нет значения, остальные поля можно не проверять
        break;
      }
    }
  }
  // В этом случае если у кнопки есть атрибут disabled, мы меняем его на true
  submitButton.disabled = !isFormField;
};

// Создадим объект с настройками валидации форм для номмера телефона
const phoneValidateOption = {
  // Формат поля
  format: {
    pattern: "\\+7\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}",
    message: 'Номер телефона должен соответствовать формату: "+7(ххх)ххх-хх-хх"'
  }
}

form.addEventListener('input', updateSubmitButton);

// Валидируем форму
form.addEventListener('submit', async (event) => {
  // Отключаем перезагрузку страницы при отправке  формы
  event.preventDefault();

  // (См стр. 14 index.html) Функция validate возвращает ошибку. В функцию передаем нашу форму и объект с настройками полей которые надо валидировать (sender_phone и receiver_phone - поля, phoneValidateOption и phoneValidateOption - настройки того как эти поля валидировать)
  const errors = validate(form, {
    sender_phone: phoneValidateOption,
    receiver_phone: phoneValidateOption,
  });
  // Если есть ошибки выводим эти ошибки
  if (errors) {
    for (const key in errors) {
      const errorString = errors[key];
      alert(errorString);
    }
    // и останавливаем эту функцию
    return;
  }

  // Если ошибок нет, считываем все данные из формы
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Делаем POST запрос и отправляем данные на сервер

  try {
    const response = await fetch(`${API_URL}/api/gift`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // После возвращения ответа, обрабатываем его
    if (response.ok) {
      // Если ошибки нет
      prompt('Открытка успешно сохранена. Доступна по адресу: ', `${location.origin}/card.html?id=${result.id}`)
      // После отправки формы очищаем ее
      form.reset();
    } else {
      // Если ошибку возвратит сервер
      alert(`Ошибка при отправке: ${response.massege}`);
    }

  } catch (error) {
    // Если ошибка будет при составлении запроса
    console.error(`Произошла ошибка при отправке ${error}`);
    alert(`Произошла ошибка, попробуйте снова`);
  }
});











