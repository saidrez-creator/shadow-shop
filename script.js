const products = [

    {
        id: 1,
        name: "EA Sports FC 26",
        category: "Games",
        price: 8900,
        icon: "⚽",
        tag: "HOT"
    },

    {
        id: 2,
        name: "Steam Wallet 20€",
        category: "Gift Cards",
        price: 4200,
        icon: "🎮",
        tag: "-20%"
    },

    {
        id: 3,
        name: "PlayStation Plus",
        category: "Memberships",
        price: 7600,
        icon: "⭐",
        tag: "TOP"
    },

    {
        id: 4,
        name: "Game Pass Ultimate",
        category: "Memberships",
        price: 6900,
        icon: "🎯",
        tag: "NEW"
    },

    {
        id: 5,
        name: "Valorant Points 2050",
        category: "Points",
        price: 5100,
        icon: "💎",
        tag: "NEW"
    },

    {
        id: 6,
        name: "Minecraft Java & Bedrock",
        category: "Games",
        price: 8400,
        icon: "⛏️",
        tag: "HOT"
    },

    {
        id: 7,
        name: "Discord Nitro",
        category: "Memberships",
        price: 3500,
        icon: "💬",
        tag: "NEW"
    },

    {
        id: 8,
        name: "PlayStation Gift Card",
        category: "Gift Cards",
        price: 5000,
        icon: "🕹️",
        tag: "TOP"
    }

];


let cart =
    JSON.parse(
        localStorage.getItem("shadowCart")
    ) || [];


let currentFilter = "All";

let searchQuery = "";


const grid =
    document.getElementById("grid");

const noResults =
    document.getElementById("none");

const search =
    document.getElementById("search");

const cartPanel =
    document.getElementById("cart");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("items");

const cartEmpty =
    document.getElementById("empty");

const cartCount =
    document.getElementById("count");

const cartTotal =
    document.getElementById("total");

const checkout =
    document.getElementById("checkout");

const toastElement =
    document.getElementById("toast");


function money(price) {

    return price.toLocaleString("en-US")
        + " DA";

}


function saveCart() {

    localStorage.setItem(
        "shadowCart",
        JSON.stringify(cart)
    );

}


function renderProducts() {

    const filtered =
        products.filter(product => {

            const categoryMatch =
                currentFilter === "All" ||
                product.category === currentFilter;

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(
                        searchQuery.toLowerCase()
                    );

            return categoryMatch &&
                searchMatch;

        });


    grid.innerHTML = "";


    filtered.forEach(product => {

        const card =
            document.createElement("article");


        card.className = "product";


        card.innerHTML = `

            <em>
                ${product.tag}
            </em>

            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-body">

                <small>
                    ${product.category}
                </small>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Premium digital gaming product.
                </p>

                <div class="product-bottom">

                    <strong class="price">
                        ${money(product.price)}
                    </strong>

                    <button
                        class="add"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });


    noResults.style.display =
        filtered.length
            ? "none"
            : "block";

}


function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );


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

    renderCart();

    showToast(
        product.name +
        " added to cart!"
    );

}


function changeQuantity(id, amount) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== id
            );

    }


    saveCart();

    renderCart();

}


function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.style.display = "flex";

    } else {

        cartEmpty.style.display = "none";


        cart.forEach(item => {

            const element =
                document.createElement("div");


            element.className =
                "cart-item";


            element.innerHTML = `

                <div class="cart-icon">
                    ${item.icon}
                </div>

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <div class="cart-item-price">
                        ${money(item.price)}
                    </div>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(
                                ${item.id},
                                -1
                            )"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(
                                ${item.id},
                                1
                            )"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove"
                    onclick="changeQuantity(
                        ${item.id},
                        -999
                    )"
                >
                    ×
                </button>

            `;


            cartItems.appendChild(
                element
            );

        });

    }


    const quantity =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    cartCount.textContent =
        quantity;


    cartTotal.textContent =
        money(total);


    checkout.disabled =
        cart.length === 0;

}


function showToast(message) {

    toastElement.textContent =
        message;

    toastElement.classList.add(
        "show"
    );


    setTimeout(() => {

        toastElement.classList.remove(
            "show"
        );

    }, 2000);

}


function openCart() {

    cartPanel.classList.add(
        "active"
    );

    overlay.classList.add(
        "active"
    );

}


function closeCart() {

    cartPanel.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}


search.addEventListener(
    "input",
    event => {

        searchQuery =
            event.target.value;

        renderProducts();

    }
);


document
    .getElementById("openCart")
    .addEventListener(
        "click",
        openCart
    );


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


document
    .querySelectorAll(
        "[data-filter]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                document
                    .querySelectorAll(
                        ".filters button"
                    )
                    .forEach(filter => {

                        filter.classList.toggle(
                            "active",
                            filter.dataset.filter ===
                            currentFilter
                        );

                    });


                renderProducts();


                document
                    .getElementById(
                        "products"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


checkout.addEventListener(
    "click",
    () => {

        if (!cart.length) return;

        showToast(
            "Checkout is coming soon!"
        );

    }
);


renderProducts();

renderCart();
