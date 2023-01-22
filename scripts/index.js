let main = document.querySelector("main");


const updCards = function (data) {
    main.innerHTML = "";
    data.forEach(function (cat) {
        if (cat.id) {
            let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: 
            url(${cat.img_link || "images/cat.jpg"})"><span>${cat.name}</span></div>`;
            main.innerHTML += card;
        }
    });
    let cards = document.getElementsByClassName("card");
    for (let i = 0, cnt = cards.length; i < cnt; i++) {
        const width = cards[i].offsetWidth;
        cards[i].style.height = width * 0.6 + "px";
    }
}


let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");

addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!popupForm.classList.contains("active")) {
        popupForm.classList.add("active");
        popupForm.parentElement.classList.add("active");
    }
});

closePopupForm.addEventListener("click", () => {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
});

const api = new Api("vasily-glazkov");
let form = document.forms[0];

form.img_link.addEventListener("change", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})

form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})

form.addEventListener("submit", e => {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < form.elements.length; i++) {
        let input = form.elements[i];
        if (input.type === "checkbox") {
            body[input.name] = input.checked;
        } else if (input.name && input.value) {
            if (input.type === "number") {
                body[input.name] = +input.value;
            } else {
                body[input.name] = input.value;
            }
        }
    }
    console.log(body);
    api.addCat(body)
        .then(response => response.json())
        .then(data => {
            if (data.message === "ok") {
                form.reset();
                closePopupForm.click();
                getCats(api);
            } else {
                console.log(data);
            }
        })
})

const getCats = function (api) {
    api.getCats()
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                updCards(data.data);
            }
        })
}

getCats(api);


// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     let formData = new FormData(form);
//     api
//         .addCat(formData)
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.message === "ok") {
//                 form.reset();
//                 closePopupForm.click();
//             } else {
//                 console.log(data);
//             }
//         });
// });


