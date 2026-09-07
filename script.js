const products = [
    {
        id: 101,
        name: "TZX",
        category: "FiveM",
        icon: "⚡",
        tag: "HOT",
        plans: [
            { name: "1 Week", price: 5 },
            { name: "1 Month", price: 10 },
            { name: "1 Year", price: 50 },
            { name: "Lifetime", price: 80 }
        ]
    },

    {
        id: 102,
        name: "RedEngine",
        category: "FiveM",
        icon: "🔥",
        tag: "NEW",
        plans: [
            { name: "1 Week", price: 7 },
            { name: "1 Month", price: 12 },
            { name: "1 Year", price: 60 },
            { name: "Lifetime", price: 80 }
        ]
    },

    {
        id: 103,
        name: "Taigo",
        category: "FiveM",
        icon: "💜",
        tag: "TOP",
        plans: [
            { name: "1 Week", price: 8 },
            { name: "1 Month", price: 15 },
            { name: "1 Year", price: 70 },
            { name: "Lifetime", price: 80 }
        ]
    }
];


let cart =
    JSON.parse(localStorage.getItem("shadowCart")) || [];

let currentFilter = "FiveM";
let searchQuery = "";


/* ELEMENTS */

const grid =
    document.getElementById("productsGrid");

const noResults =
    document.getElementById("emptyProducts");

const search =
    document.getElementById("searchInput");

const cartPanel =
    document.getElementById("cartPanel");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkout =
    document.getElementById("checkoutButton");

const toastElement =
    document.getElementById("toast");


/* MONEY */

function money(price) {
    return Number(price).toLocaleString("en-US") + " €";
}


/* SAVE CART */

function saveCart() {

    localStorage.setItem(
        "shadowCart",
        JSON.stringify(cart)
    );

}


/* PRODUCTS */

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
                    Choose your access duration.
                </p>

                <div class="plans">

                    ${product.plans.map(plan => `

                        <button
                            class="plan-button"
                            onclick="
                                addPlanToCart(
                                    ${product.id},
                                    '${plan.name}',
                                    ${plan.price}
                                )
                            "
                        >

                            <span>
                                ${plan.name}
                            </span>

                            <strong>
                                ${money(plan.price)}
                            </strong>

                        </button>

                    `).join("")}

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


/* ADD PLAN TO CART */

function addPlanToCart(
    productId,
    planName,
    planPrice
) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const cartId =
        productId + "-" + planName;


    const existing =
        cart.find(
            item =>
                item.cartId === cartId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            cartId: cartId,

            id: product.id,

            name:
                product.name +
                " — " +
                planName,

            category:
                product.category,

            icon:
                product.icon,

            price:
                planPrice,

            plan:
                planName,

            quantity: 1
        });

    }


    saveCart();

    renderCart();

    showToast(
        product.name +
        " " +
        planName +
        " added to cart!"
    );

}


/* QUANTITY */

function changeQuantity(
    cartId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.cartId !== cartId
            );

    }


    saveCart();

    renderCart();

}


/* CART */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.style.display =
            "flex";

    } else {

        cartEmpty.style.display =
            "none";


        cart.forEach(item => {

            const element =
                document.createElement("div");


            element.className =
                "cart-item";


            element.innerHTML = `

                <div class="cart-icon">
                    ${item.icon || "🎮"}
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
                            onclick="
                                changeQuantity(
                                    '${item.cartId}',
                                    -1
                                )
                            "
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="
                                changeQuantity(
                                    '${item.cartId}',
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove"
                    onclick="
                        changeQuantity(
                            '${item.cartId}',
                            -999
                        )
                    "
                >
                    ×
                </button>

            `;


            cartItems.appendChild(element);

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


/* TOAST */

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


/* OPEN CART */

function openCart() {

    cartPanel.classList.add(
        "active"
    );

    overlay.classList.add(
        "active"
    );

}


/* CLOSE CART */

function closeCart() {

    cartPanel.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}


/* SEARCH */

if (search) {

    search.addEventListener(
        "input",
        event => {

            searchQuery =
                event.target.value;

            renderProducts();

        }
    );

}


/* CART BUTTON */

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


/* CONTINUE SHOPPING */

document
    .getElementById("continueShopping")
    .addEventListener(
        "click",
        closeCart
    );


/* FILTERS */

document
    .querySelectorAll("[data-filter]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                document
                    .querySelectorAll(".filter")
                    .forEach(filter => {

                        filter.classList.toggle(
                            "active",
                            filter.dataset.filter ===
                            currentFilter
                        );

                    });


                renderProducts();


                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* CATEGORY CARDS */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                currentFilter =
                    card.dataset.category;


                renderProducts();


                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* CHECKOUT */

checkout.addEventListener(
    "click",
    () => {

        if (!cart.length) return;

        showToast(
            "Checkout is coming soon!"
        );

    }
);


/* START */

document
    .querySelectorAll(".filter")
    .forEach(filter => {

        filter.classList.toggle(
            "active",
            filter.dataset.filter === "FiveM"
        );

    });


renderProducts();

renderCart();
