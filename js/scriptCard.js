const API_URL = 'https://imminent-midnight-glasses.glitch.me/';

const card = document.querySelector('.card');
const cardTitle = document.querySelector('.card__title');
const cardContacts = document.querySelector('.card__contacts');

const cardImage = document.querySelector('.card__image');
const cardFrom = document.querySelector('.card__from');
const cardTo = document.querySelector('.card__to');
const cardMessage = document.querySelector('.card__message');

// Создаем медиазапрос через javascript
const mediaQuery = window.matchMedia("(max-width: 580px)");

// Создадим функцию перемещения блока с контактами в зависимости от ширины экрана
const rearrangeElement = (e) => {
  if (e.matches) {
    card.after(cardContacts);
  } else {
    cardTitle.after(cardContacts);
  }
};

// Напишем функцию находящую id карточки по её адресу
const getIdFromUrl = () => {
  const params = new URLSearchParams(location.search);
  return params.get('id');
}

const getGiftData = async (id) => {
  // При запросах на сервер конструкция try catch обязательна
  try {
    const response = await fetch(`${API_URL}/api/gift/${id}`);
    if (response.ok) {
      return response.json();
    } else {
      // Иначе создаем ошибку
      throw new Error('Открытка не найдена');
    }
  } catch (error) {
    console.error(error);
  }
};


// создадим функцию которая будет запускать функцию перемещения блока с контактами при изменении размера окна
const init = async () => {
  rearrangeElement(mediaQuery);
  mediaQuery.addEventListener('change', rearrangeElement);
  // находим id карточки из её URL адреса
  const id = getIdFromUrl();

  // Если id есть, делаем запрос на сервер для получения данных для отображения
  if (id) {
    const data = await getGiftData(id);

    // Если есть данные
    if (data) {
      cardImage.src = `img/${data.card}.jpg`;
      cardFrom.textContent = data.sender_name;
      cardTo.textContent = data.receiver_name;
      // Если в тексте сообщения будут переносы строк, то для того, чтобы они сохранились пишем следующее
      const formattedMasseger = data.massege.replaceAll("\n", "<br>");
      // ИЛИ  const formattedMasseger = data.massege.replace(/\n/g, "<br>")
      cardMessage.innerHTML = formattedMasseger;
    }
  }
};
// Запустим эту функцию
init();

