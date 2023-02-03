const loginMessage = document.querySelector("#main h3");
const cardsContainer = document.querySelector("#cards-container");
const addBtn = document.querySelector("#add");
const popupForm = document.querySelector("#popup-form");
const closePopupForm = popupForm.querySelector(".popup-close");
const loginButton = document.querySelector("#login-btn");
const authFormPopup = document.querySelector("#auth-form-popup");
const authForm = document.querySelector("#auth-form");
const closeUpdateForm = document.querySelector("#close-update-form");
const closeAuthForm = document.querySelector("#close-auth");
const userName = document.querySelector("label input[name='username']");
const catDetailsCard = document.querySelector("#cat-details");
const catName = document.getElementById("cat-name");
const catAge = document.getElementById("cat-age");
const catImage = document.getElementById("cat-image");
const catDescription = document.querySelector("#cat-description");
const updateBtn = document.querySelector("#updateBtn");
const updateFormPopup = document.querySelector("#update-form-popup");
const updateForm = document.getElementById("update-form");
const deleteBtn = document.querySelector("#delete-btn");

function mainFunc() {

    // Создаем экземпляр api
    const api = new Api("vasily-glazkov");

    // Кнопка добавления кота скрыта до авторизации
    addBtn.style.display = "none";

    // Добавляем слушатель событий на кнопку войти
    loginButton.addEventListener("click", function () {
        if (!authFormPopup.classList.contains("active")) {

            // Делаем активной форму авторизации
            makeActive(authFormPopup);
        }
    });

    // Добавляем слушатель событий на форму авторизации
    authForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Получаем данные из формы авторизации
        let authData = new FormData(authForm);

        // Делаем итерацию по данным и декомпозируем
        for (const [key, value] of authData.entries()) {

            // Устанавливаем куки
            document.cookie = `${key}=${value}; SameSite=Strict`;
        }

        onSuccessfulLogin(userName); // Скрываем кнопку "войти" и отображаем имя

        // Скрываем сообщение об авторизации
        loginMessage.style.display = "none";

        // Делаем видимым контейнер с карточками
        cardsContainer.style.display = "grid";

        // Вызываем функцию получения котов
        getCats(api);

        // Очищаем форму
        authForm.reset();

        // Скрываем форму
        hide(authFormPopup);
    });

    // Добавляем слушатель событий на кнопку закрытия формы авторизации
    closeAuthForm.addEventListener("click", () => {
        // вызываем функцию убирающую class="active"
        hide(authFormPopup);
    });

    // Добавляем event listener на кнопку добавления кота
    addBtn.addEventListener("click", (e) => {
        // Prevent default behavior
        e.preventDefault();
        hide(updateFormPopup);

        // Делаем форму активной 
        if (!popupForm.classList.contains("active")) {
            makeActive(popupForm);
        }
    });

    // Добавляем слушатель событий на кнопку закрытия формы
    closePopupForm.addEventListener("click", () => {
        // вызываем функцию убирающую class="active"
        hide(popupForm);
    });

    // Получаем первый элемент формы
    let form = document.forms[0];

    // Добавляем слушатель на ввод и изменение поля адреса картинки
    form.img_link.addEventListener("change", (e) => {
        form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
    })
    form.img_link.addEventListener("input", (e) => {
        form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
    })

    // Добавляем слушатель на нажатие кнопки "Добавить котика"
    form.addEventListener("submit", e => {
        e.preventDefault();

        // читаем данные из полей формы и сохраняем объект в переменную
        let body = readFormData(form);

        // Очищаем локальное хранилище, чтобы добавился новый кот на страницу
        // иначе данные будут считываться локально
        localStorage.clear();

        // С помощью API отправляем запрос на добавление кота на сервер
        api.addCat(body)
            .then(response => response.json())
            .then(data => {

                // Проверяем успешность отправки
                if (data.message === "ok") {

                    // Очищаем поля формы
                    form.reset();

                    // Закрываем форму
                    closePopupForm.click();

                    // API запрос к серверу на получение данных котов
                    // и отбражаем их карточки на странице
                    getCats(api);
                } else {
                    console.log(data);
                }
            })
    });

    // Детальное отображение кота по клику на его карточке
    const onCatClick = (event) => {

        // Получаем id карточки кота
        let id = event.target.id;

        // Создаем переменную с локальными данными кота
        const catData = JSON.parse(localStorage.getItem(`cat_${id}`));

        // Если данные имеются локально, то рендерим, если нет, то берем через api
        if (catData) {
            // Наполняем карточку данными
            renderCat(catData)

            // Если карточка скрыта, то отображаем ее
            if (!catDetailsCard.classList.contains("active")) {
                makeActive(catDetailsCard);
            }
        } else {
            api
                .getCat(id)
                .then((response) => response.json())
                .then((data) => {
                    // Проверяем наличие данных
                    if (data.data) {

                        // Добавляем данные в локальное хранилище
                        localStorage.setItem(`cat_${id}`, JSON.stringify(data.data));

                        // Отрисовываем карточку с котом (данными заполняем)
                        renderCat(data.data);

                        // Если карточка скрыта, то отображаем ее
                        if (!catDetailsCard.classList.contains("active")) {
                            makeActive(catDetailsCard);
                        }
                    } else {
                        console.error("No data found.");
                    }
                })
                .catch((error) => console.error(error));
        }

        // При нажатии на кнопку "Изменить" в карточке кота
        updateBtn.addEventListener("click", () => {
            // Прячем карточку кота
            hide(catDetailsCard);

            // Активируем форму изменения данных
            makeActive(updateFormPopup);
            closeUpdateForm.addEventListener("click", () => {
                hide(updateFormPopup);
            })

            // Предзаполняем поля формы исходными данными для удобства редактирования
            document.getElementById("update-name").value = JSON.parse(localStorage.getItem(`cat_${id}`)).name;
            document.getElementById("update-age").value = JSON.parse(localStorage.getItem(`cat_${id}`)).age;
            document.getElementById("update-description").value = JSON.parse(localStorage.getItem(`cat_${id}`)).description;
            document.getElementById("update-img-link").value = JSON.parse(localStorage.getItem(`cat_${id}`)).img_link;
        })


        // При нажатии на кнопку "Изменить" в форме редактирования данных
        updateForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Берем обновленные данные из формы
            const updatedData = {
                name: updateForm.elements.name.value,
                age: +updateForm.elements.age.value,
                description: updateForm.elements.description.value,
                img_link: updateForm.elements.img_link.value,
            }

            // Обновляем данные кота используя api.updCat(id, body)
            api.updCat(id, updatedData)
                .then(response => response.json())
                .then(data => {
                    // Проверяем успешность отправки
                    if (data.message === "ok") {

                        // Закрываем форму
                        hide(updateFormPopup);

                        // Чистим локальное хранилище для обновления данных
                        localStorage.clear();

                        // API запрос к серверу на получение данных котов
                        // и отбражаем их карточки на странице
                        getCats(api);
                    } else {
                        console.log(data);
                    }
                })
        })

        // При нажатии на кнопку "Удалить" в форме редактирования данных
        deleteBtn.addEventListener("click", () => {

            // Проверяем случайность нажатия
            if (confirm("Вы точно хотите удалить котика?")) {
                api.delCat(id)
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === "ok") {
                            // Прячем форму
                            hide(updateFormPopup);

                            // Выводим алерт
                            alert("Кот удален");

                            // Чистим локальное хранилище для обновления данных
                            localStorage.clear();

                            // API запрос к серверу на получение данных котов
                            // и отбражаем их карточки на странице
                            getCats(api);
                        } else {
                            console.log(data);
                        }
                    })
            }
        })
    }
    // Отслеживаем нажатие на карточку с котом
    cardsContainer.addEventListener('click', onCatClick);
}

mainFunc();
