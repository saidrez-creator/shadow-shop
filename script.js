const products = [
    {
        id: 1,
        name: "EA Sports FC 26",
        category: "Games",
        price: 8900,
        icon: "⚽",
        description: "The ultimate football gaming experience."
    },

    {
        id: 2,
        name: "Minecraft Java & Bedrock",
        category: "Games",
        price: 8400,
        icon: "⛏️",
        description: "Build, explore and survive your own world."
    },

    {
        id: 3,
        name: "Steam Wallet 20€",
        category: "Gift Cards",
        price: 4200,
        icon: "🎮",
        description: "Add funds to your Steam account instantly."
    },

    {
        id: 4,
        name: "PlayStation Gift Card",
        category: "Gift Cards",
        price: 5000,
        icon: "🕹️",
        description: "Shop games and digital content on PlayStation."
    },

    {
        id: 5,
        name: "PlayStation Plus",
        category: "Memberships",
        price: 7600,
        icon: "⭐",
        description: "Unlock online multiplayer and monthly games."
    },

    {
        id: 6,
        name: "Game Pass Ultimate",
        category: "Memberships",
        price: 6900,
        icon: "🎯",
        description: "Access a huge library of amazing games."
    },

    {
        id: 7,
        name: "Valorant Points 2050",
        category: "Points",
        price: 5100,
        icon: "💎",
        description: "Get Valorant Points for your account."
    },

    {
        id: 8,
        name: "Discord Nitro",
        category: "Memberships",
        price: 3500,
        icon: "💬",
        description: "Upgrade your Discord experience with Nitro."
    }
];


let cart = JSON.parse(localStorage.getItem("shadowCart")) || [];

let currentFilter = "All";
let searchTerm = "";


const productsGrid = document.getElementById("productsGrid");
const emptyProducts = document.getElementById("emptyProducts");

const searchInput = document.getElementById("searchInput");

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");

const toast = document.getElementById("toast");


/* Format price */

function formatPrice(price) {
    return price.toLocaleString("en-US") + " DA";
}


/* Save cart */

function saveCart() {
    localStorage.setItem("shadowCart", JSON.stringify(cart));
}


/* Render products */

function renderProducts() {

    const filteredProducts = products.filter(product => {

        const matchesCategory =
            currentFilter === "All" ||
            product.category === currentFilter;

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });


    productsGrid.innerHTML = "";


    filteredProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-title">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        productsGrid.appendChild(card);
    });


    if (filteredProducts.length === 0) {
        emptyProducts.classList.add("show");
    } else {
        emptyProducts.classList.remove("show");
    }
}


/* Add product */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }


    saveCart();
    renderCart();

    showToast(`${product.name} added to cart!`);
}


/* Remove product */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    renderCart();
}


/* Change quantity */

function changeQuantity(productId, change) {

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }


    saveCart();
    renderCart();
}


/* Render cart */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.classList.add("show");
        cartItems.style.display = "none";

    } else {

        cartEmpty.classList.remove("show");
        cartItems.style.display = "block";


        cart.forEach(item => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `

                <div class="cart-item-image">
                    ${item.icon}
                </div>

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <div class="cart-item-price">
                        ${formatPrice(item.price)}
                    </div>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${item.id})"
                    title="Remove"
                >
                    ×
                </button>

            `;


            cartItems.appendChild(cartItem);
        });
    }


    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    checkoutButton.disabled = cart.length === 0;
}


/* Open cart */

function openCart() {

    cartPanel.classList.add("active");
    overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* Close cart */

function closeCart() {

    cartPanel.classList.remove("active");
    overlay.classList.remove("active");

    document.body.style.overflow = "";
}


/* Toast */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


/* Search */

searchInput.addEventListener("input", event => {

    searchTerm = event.target.value;

    renderProducts();
});


/* Filters */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(btn =>
                btn.classList.remove("active")
            );


        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderProducts();
    });
});


/* Category buttons */

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter =
            button.dataset.category;


        document
            .querySelectorAll(".filter")
            .forEach(filter => {

                filter.classList.toggle(
                    "active",
                    filter.dataset.filter === currentFilter
                );
            });


        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });


        renderProducts();
    });
});


/* Cart buttons */

document
    .getElementById("openCart")
    .addEventListener("click", openCart);


document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);


overlay.addEventListener("click", closeCart);


document
    .getElementById("continueShopping")
    .addEventListener("click", closeCart);


/* Checkout */

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) return;

    showToast(
        "Checkout system coming soon!"
    );
});


/* Start */

renderProducts();
renderCart();
