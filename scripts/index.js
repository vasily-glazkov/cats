let main = document.querySelector("main");

/**
 * This function takes an object data and re-renders the cards with cats.
 * @param {object} data - JavaScript object with cat's data
 */
const updCards = function (data) {
    // Clear the main element's innerHTML
    main.innerHTML = "";
    // Iterate over data array
    data.forEach(function (cat) {
        // Check if cat has an id
        if (cat.id) {
            // Create a new card element with cat's data
            let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: 
            url(${cat.img_link || "images/cat.jpg"})"><span>${cat.name}</span></div>`;
            // Append the card to the main element
            main.innerHTML += card;
        }
    });

    // Get all card elements
    let cards = document.getElementsByClassName("card");
    for (let i = 0, count = cards.length; i < count; i++) {
        // Calculate the height of the card based on its width
        const width = cards[i].offsetWidth;
        cards[i].style.height = width * 0.6 + "px";
    }
}

// Get the add button and popup form elements
let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
let loginButton = document.querySelector("#login-btn");
let authFormPopup = document.querySelector("#auth-form-popup");
let authForm = document.querySelector("#auth-form");
let closeAuthForm = document.querySelector("#close-auth");

// Add click event listener to add button
addBtn.addEventListener("click", (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Add active class to popup form and its parent element
    if (!popupForm.classList.contains("active")) {
        popupForm.classList.add("active");
        popupForm.parentElement.classList.add("active");
    }
});

// Add click event listener to close button in the popup form
closePopupForm.addEventListener("click", () => {
    // Remove active class from popup form and its parent element
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
});

// Add click event listener to login button
loginButton.addEventListener("click", function () {
    if (!authFormPopup.classList.contains("active")) {
        authFormPopup.classList.add("active");
        authFormPopup.parentElement.classList.add("active");
    }
});

// Add click event listener to close button in the authorization form
closeAuthForm.addEventListener("click", () => {
    // Remove active class from popup form and its parent element
    authFormPopup.classList.remove("active");
    authFormPopup.parentElement.classList.remove("active");
});

authForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // Get the form data
    let authData = new FormData(authForm);
    console.log(authData)
    // Iterate over the form data
    for (const [key, value] of authData.entries()) {
        // Set a cookie for each form field
        document.cookie = `${key}=${value}`;
    }
    // Show an alert to confirm the cookies have been set
    alert("Вы успешно вошли");
    authForm.reset();
    authFormPopup.classList.remove("active");
    authFormPopup.parentElement.classList.remove("active");
});

// Create new instance of Api class
const api = new Api("vasily-glazkov");
// Get the first form element
let form = document.forms[0];

// Add change and input event listeners to image link input
form.img_link.addEventListener("change", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})

form.addEventListener("submit", e => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Create an empty object to store the form data
    let body = {};
    // Iterate over form elements
    for (let i = 0; i < form.elements.length; i++) {
        let input = form.elements[i];
        // Check if the input is a checkbox
        if (input.type === "checkbox") {
            // Add the checkbox value to the body object
            body[input.name] = input.checked;
        } else if (input.name && input.value) {
            // Check if the input is a number
            if (input.type === "number") {
                // Convert the input value to a number and add it to the body object
                body[input.name] = +input.value;
            } else {
                // Add the input value to the body object
                body[input.name] = input.value;
            }
        }
    }
    // Log the body object to the console
    console.log(body);
    // Make an API call to add the cat using the body object as the data
    api.addCat(body)
        .then(response => response.json())
        .then(data => {
            // Check if the API call was successful
            if (data.message === "ok") {
                // Reset the form
                form.reset();
                // Close the popup form
                closePopupForm.click();
                // Get the cats from the API and update the cards
                getCats(api);
            } else {
                console.log(data);
            }
        })
});


const getCats = function (api) {
    // Make an API call to get the cats
    api.getCats()
        // Convert the response to JSON
        .then(res => res.json())
        .then(data => {
            // Check if the API call was successful
            if (data.message === "ok") {
                // Pass the data to the updCards function to update the cards
                updCards(data.data);
            }
        })
}

// Call the getCats function and pass in the api instance
getCats(api);




