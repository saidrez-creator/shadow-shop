const products = [

    {
        id: 1,
        name: "FiveM Key",
        category: "FiveM",
        price: 500,
        image: "fivem.jpg"
    },

    {
        id: 2,
        name: "FiveM Server",
        category: "FiveM",
        price: 1500,
        image: "fivem.jpg"
    },

    {
        id: 3,
        name: "CS2 Prime Upgrade",
        category: "CS2",
        price: 900,
        image: "cs2.jpg"
    },

    {
        id: 4,
        name: "CS2 Skins",
        category: "CS2",
        price: 1200,
        image: "cs2.jpg"
    },

    {
        id: 5,
        name: "Valorant VP 1000",
        category: "Valorant",
        price: 1000,
        image: "valorant.jpg"
    },

    {
        id: 6,
        name: "Valorant Gift Card",
        category: "Valorant",
        price: 1500,
        image: "valorant.jpg"
    },

    {
        id: 7,
        name: "PlayStation Gift Card",
        category: "Gift Cards",
        price: 5000,
        image: "banner.jpg"
    },

    {
        id: 8,
        name: "Steam Gift Card",
        category: "Gift Cards",
        price: 4200,
        image: "banner.jpg"
    },

    {
        id: 9,
        name: "PlayStation Plus",
        category: "Memberships",
        price: 7600,
        image: "banner.jpg"
    },

    {
        id: 10,
        name: "Game Pass Ultimate",
        category: "Memberships",
        price: 6900,
        image: "banner.jpg"
    }

];


let cart = JSON.parse(
    localStorage.getItem("shadowCart")
) || [];


const grid =
    document.getElementById("grid");

const none =
    document.getElementById("none");

const search =
    document.getElementById("search");

const count =
    document.getElementById("count");

const total =
    document.getElementById("total");

const cartElement =
    document.getElementById("cart");

const overlay =
    document.getElementById("overlay");

const items =
    document.getElementById("items");

const empty =
    document.getElementById("empty");

const toast =
    document.getElementById("toast");


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts(
    filter = "All",
    searchText = ""
) {

    grid.innerHTML = "";

    const text =
        searchText.toLowerCase().trim();

    const filtered =
        products.filter(product => {

            const matchesFilter =
                filter === "All" ||
                product.category === filter;

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(text);

            return matchesFilter &&
                   matchesSearch;
        });


    if (filtered.length === 0) {

        none.style.display = "block";

        return;

    }

    none.style.display = "none";


    filtered.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-info">

                <small>
                    ${product.category}
                </small>

                <h3>
                    ${product.name}
                </h3>

                <div class="product-bottom">

                    <strong>
                        ${product.price.toLocaleString()} DA
                    </strong>

                    <button
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;

        grid.appendChild(card);

    });

}


/* =========================================
   FILTER BUTTONS
========================================= */

document
    .querySelectorAll("[data-filter]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;

                displayProducts(
                    filter,
                    search.value
                );


                document
                    .querySelectorAll(
                        ".filters button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                if (
                    button.closest(".filters")
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                if (
                    button.closest("#categories")
                ) {

                    document
                        .getElementById("products")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }

            }
        );

    });


/* =========================================
   SEARCH
========================================= */

search.addEventListener(
    "input",
    () => {

        const active =
            document.querySelector(
                ".filters button.active"
            );

        const filter =
            active
                ? active.dataset.filter
                : "All";

        displayProducts(
            filter,
            search.value
        );

    }
);


/* =========================================
   CART
========================================= */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    showToast(
        product.name + " added to cart!"
    );

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "shadowCart",
        JSON.stringify(cart)
    );

    updateCart();

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    items.innerHTML = "";


    let totalPrice = 0;
    let totalItems = 0;


    cart.forEach(product => {

        totalItems += product.quantity;

        totalPrice +=
            product.price *
            product.quantity;


        const item =
            document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div>

                <b>
                    ${product.name}
                </b>

                <small>
                    ${product.price.toLocaleString()} DA
                </small>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `;


        items.appendChild(item);

    });


    count.textContent =
        totalItems;

    total.textContent =
        totalPrice.toLocaleString() +
        " DA";


    empty.style.display =
        cart.length
            ? "none"
            : "block";

}


/* =========================================
   QUANTITY
========================================= */

function changeQuantity(
    id,
    amount
) {

    const product =
        cart.find(
            item => item.id === id
        );

    if (!product) return;


    product.quantity += amount;


    if (product.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveCart();

}


/* =========================================
   OPEN CART
========================================= */

document
    .getElementById("openCart")
    .addEventListener(
        "click",
        () => {

            cartElement.classList.add(
                "open"
            );

            overlay.classList.add(
                "show"
            );

        }
    );


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    cartElement.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );

}


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


/* =========================================
   CHECKOUT
========================================= */

document
    .getElementById("checkout")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Your cart is empty."
                );

                return;

            }

            showToast(
                "Checkout coming soon!"
            );

        }
    );


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================
   START
========================================= */

displayProducts();

updateCart();