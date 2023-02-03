
// Обновляет страницу с карточками добавляя все, которые есть в базе
const updCards = function (data) {
    // Получаем все элементы с классом "card"
    const cards = document.getElementsByClassName("card");

    // Чистим cardsContainer innerHTML
    cardsContainer.innerHTML = "";

    // Проходим по массиву с данными
    data.forEach(function (cat) {
        // Проверка на наличие id
        if (cat.id) {

            // Создаем новый элемент card и наполняем данными
            let card = `<div id="${cat.id}" class="${cat.favourite ? "card like" : "card"}" style="background-image: 
            url(${cat.img_link || "images/cat.jpg"})"><span>${cat.name}</span></div>`;

            // Добавляем card к элементу cardsContainer
            cardsContainer.innerHTML += card;
        }
    });

    for (let i = 0, count = cards.length; i < count; i++) {
        // Рассчитываем высоту карточки пропорционально ширине
        const width = cards[i].offsetWidth;
        cards[i].style.height = width * 0.6 + "px";
    }
}

// Получаем данные о котах из локального хранилища
// либо по запросу к api
const getCats = function (api) {
    let localData = JSON.parse(window.localStorage.getItem('cats'));
    // если локальные данные имеются, то создаем карточки из локальных данных
    if (localData) {
        updCards(localData.data);
    } else {
        // отправляем API запрос чтобы получить котов
        api.getCats()
            // Конвертируем response в JSON
            .then(response => response.json())
            .then(data => {
                if (data.message === "ok") {
                    // перерисовываем карточки на странице
                    updCards(data.data);
                    // добавляем данные в локальное хранилище
                    localStorage.setItem('cats', JSON.stringify(data));
                }
            });
    }
}

// Функция при успешной авторизации убирает с экрана кнопку "Войти"
// и отображает вместо нее имя пользователя
function onSuccessfulLogin(name) {
    loginButton.style.display = "none";
    addBtn.style.display = "flex";

    document.querySelector("#user_name").innerHTML = name.value;
    document.querySelector("#user_name").style.display = "block";
}

// Отображает данные выбранного кота в всплывающей карточке
function renderCat(data) {
    catName.innerHTML = "Имя: " + data.name;
    catAge.innerHTML = "Возраст: " + data.age;
    catImage.src = data.img_link;
    catDescription.innerHTML = "Описание: " + data.description;
}

// Добавляет элементу и его родителю класс "active"
function makeActive(element) {
    element.classList.add("active");
    element.parentElement.classList.add("active");
}

// Убирает у элемента и его родителя класс "active"
function hide(element) {
    element.classList.remove("active");
    element.parentElement.classList.remove("active");
}

// Считывает данные с формы добавления кота
function readFormData(form) {
    // Создаем пустой объект для хранения данных
    let body = {};

    // Перебираем элементы
    for (let i = 0; i < form.elements.length; i++) {
        let input = form.elements[i];

        // Проверяем является ли поле ввода checkbox
        if (input.type === "checkbox") {
            // Добавляем значение checkbox к body
            body[input.name] = input.checked;

        } else if (input.name && input.value) {

            // Проверяем если данные являются числом
            if (input.type === "number") {
                // Конвертируем в числовое значение и добавляем к данным
                body[input.name] = +input.value;

            } else {
                // В остальных случаях сразу добавляем данные в body
                body[input.name] = input.value;
            }
        }
    }
    return body;
}
