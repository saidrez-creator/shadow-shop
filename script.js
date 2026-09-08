/* ================================= */
/* FEATURED PRODUCTS */
/* ================================= */

const featuredProducts = [

    {
        id: 1,
        name: "CS2 Game Key",
        category: "CS2",
        icon: "🎮",
        price: 25,
        tag: "HOT"
    },

    {
        id: 2,
        name: "CS2 Premium Skin",
        category: "CS2",
        icon: "🎯",
        price: 18,
        tag: "TOP"
    },

    {
        id: 3,
        name: "Valorant Points",
        category: "Valorant",
        icon: "💎",
        price: 20,
        tag: "NEW"
    },

    {
        id: 4,
        name: "Valorant Gift Card",
        category: "Valorant",
        icon: "🟣",
        price: 22,
        tag: "TOP"
    },

    {
        id: 5,
        name: "Steam Wallet 20€",
        category: "Gift Cards",
        icon: "🎮",
        price: 20,
        tag: "HOT"
    },

    {
        id: 6,
        name: "Discord Nitro",
        category: "Memberships",
        icon: "💬",
        price: 10,
        tag: "NEW"
    }

];


/* ================================= */
/* FIVEM PRODUCTS */
/* ================================= */

const fivemProducts = [

    {
        id: 101,
        name: "TZX",
        icon: "⚡",
        tag: "HOT",

        plans: [
            {
                name: "1 Week",
                price: 5
            },

            {
                name: "1 Month",
                price: 10
            },

            {
                name: "1 Year",
                price: 50
            },

            {
                name: "Lifetime",
                price: 80
            }
        ]
    },


    {
        id: 102,
        name: "RedEngine",
        icon: "🔥",
        tag: "NEW",

        plans: [
            {
                name: "1 Week",
                price: 7
            },

            {
                name: "1 Month",
                price: 12
            },

            {
                name: "1 Year",
                price: 60
            },

            {
                name: "Lifetime",
                price: 80
            }
        ]
    },


    {
        id: 103,
        name: "Taigo",
        icon: "💜",
        tag: "TOP",

        plans: [
            {
                name: "1 Week",
                price: 8
            },

            {
                name: "1 Month",
                price: 15
            },

            {
                name: "1 Year",
                price: 70
            },

            {
                name: "Lifetime",
                price: 80
            }
        ]
    }

];


/* ================================= */
/* CART */
/* ================================= */

let cart =
    JSON.parse(
        localStorage.getItem("shadowCart")
    ) || [];


let currentFilter = "All";

let searchQuery = "";


/* ================================= */
/* ELEMENTS */
/* ================================= */

const productsGrid =
    document.getElementById(
        "productsGrid"
    );


const fivemGrid =
    document.getElementById(
        "fivemGrid"
    );


const emptyProducts =
    document.getElementById(
        "emptyProducts"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const fivemStore =
    document.getElementById(
        "fivemStore"
    );


const productsSection =
    document.getElementById(
        "products"
    );


const cartPanel =
    document.getElementById(
        "cartPanel"
    );


const overlay =
    document.getElementById(
        "overlay"
    );


const cartItems =
    document.getElementById(
        "cartItems"
    );


const cartEmpty =
    document.getElementById(
        "cartEmpty"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


const checkout =
    document.getElementById(
        "checkoutButton"
    );


const toast =
    document.getElementById(
        "toast"
    );


/* ================================= */
/* MONEY */
/* ================================= */

function money(price) {

    return (
        Number(price)
            .toLocaleString("en-US")
        + " €"
    );

}


/* ================================= */
/* SAVE CART */
/* ================================= */

function saveCart() {

    localStorage.setItem(
        "shadowCart",
        JSON.stringify(cart)
    );

}


/* ================================= */
/* FEATURED PRODUCTS */
/* ================================= */

function renderFeaturedProducts() {

    const filtered =
        featuredProducts.filter(
            product => {

                const categoryMatch =
                    currentFilter === "All" ||
                    product.category === currentFilter;


                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(
                            searchQuery
                                .toLowerCase()
                        );


                return (
                    categoryMatch &&
                    searchMatch
                );

            }
        );


    productsGrid.innerHTML = "";


    filtered.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product";


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
                            onclick="
                                addFeaturedToCart(
                                    ${product.id}
                                )
                            "
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                card
            );

        }
    );


    emptyProducts.style.display =
        filtered.length
            ? "none"
            : "block";

}


/* ================================= */
/* FIVEM PRODUCTS */
/* ================================= */

function renderFiveMProducts() {

    fivemGrid.innerHTML = "";


    fivemProducts.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product fivem-product";


            card.innerHTML = `

                <em>
                    ${product.tag}
                </em>


                <div class="product-image">

                    ${product.icon}

                </div>


                <div class="product-body">

                    <small>
                        FIVEM
                    </small>


                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        Choose your access duration.
                    </p>


                    <div class="plans">

                        ${product.plans.map(
                            plan => `

                            <button
                                class="plan-button"
                                onclick="
                                    addFiveMPlan(
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

                        `
                        ).join("")}

                    </div>

                </div>

            `;


            fivemGrid.appendChild(
                card
            );

        }
    );

}


/* ================================= */
/* OPEN FIVEM */
/* ================================= */

function openFiveM() {

    fivemStore.classList.add(
        "visible"
    );


    fivemStore.scrollIntoView({
        behavior: "smooth"
    });


    renderFiveMProducts();

}


/* ================================= */
/* CLOSE FIVEM */
/* ================================= */

function closeFiveM() {

    fivemStore.classList.remove(
        "visible"
    );


    productsSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================================= */
/* FIVEM CATEGORY */
/* ================================= */

document
    .querySelectorAll(
        '.category-card[data-category="FiveM"]'
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                openFiveM
            );

        }
    );


/* ================================= */
/* OTHER CATEGORY CARDS */
/* ================================= */

document
    .querySelectorAll(
        ".category-card"
    )
    .forEach(
        card => {

            if (
                card.dataset.category ===
                "FiveM"
            ) {
                return;
            }


            card.addEventListener(
                "click",
                () => {

                    currentFilter =
                        card.dataset.category;


                    document
                        .querySelectorAll(
                            ".filter"
                        )
                        .forEach(
                            filter => {

                                filter.classList.toggle(
                                    "active",
                                    filter.dataset.filter ===
                                    currentFilter
                                );

                            }
                        );


                    renderFeaturedProducts();


                    productsSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        }
    );


/* ================================= */
/* BACK BUTTON */
/* ================================= */

document
    .getElementById(
        "backToProducts"
    )
    .addEventListener(
        "click",
        closeFiveM
    );


/* ================================= */
/* FIVEM PLAN -> CART */
/* ================================= */

function addFiveMPlan(
    productId,
    planName,
    planPrice
) {

    const product =
        fivemProducts.find(
            item =>
                item.id === productId
        );


    if (!product) {
        return;
    }


    const cartId =
        productId +
        "-" +
        planName;


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
                "FiveM",

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


/* ================================= */
/* FEATURED -> CART */
/* ================================= */

function addFeaturedToCart(
    productId
) {

    const product =
        featuredProducts.find(
            item =>
                item.id === productId
        );


    if (!product) {
        return;
    }


    const cartId =
        "featured-" +
        productId;


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
                product.name,

            category:
                product.category,

            icon:
                product.icon,

            price:
                product.price,

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


/* ================================= */
/* QUANTITY */
/* ================================= */

function changeQuantity(
    cartId,
    amount
) {

    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                product =>
                    product.cartId !== cartId
            );

    }


    saveCart();

    renderCart();

}


/* ================================= */
/* CART */
/* ================================= */

function renderCart() {

    cartItems.innerHTML = "";


    if (
        cart.length === 0
    ) {

        cartEmpty.style.display =
            "flex";

    } else {

        cartEmpty.style.display =
            "none";


        cart.forEach(
            item => {

                const element =
                    document.createElement(
                        "div"
                    );


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


                cartItems.appendChild(
                    element
                );

            }
        );

    }


    const quantity =
        cart.reduce(
            (sum, item) =>
                sum +
                item.quantity,
            0
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    cartCount.textContent =
        quantity;


    cartTotal.textContent =
        money(total);


    checkout.disabled =
        cart.length === 0;

}


/* ================================= */
/* SEARCH */
/* ================================= */

searchInput.addEventListener(
    "input",
    event => {

        searchQuery =
            event.target.value;


        renderFeaturedProducts();

    }
);


/* ================================= */
/* FILTERS */
/* ================================= */

document
    .querySelectorAll(
        ".filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.filter;


                    document
                        .querySelectorAll(
                            ".filter"
                        )
                        .forEach(
                            filter => {

                                filter.classList.toggle(
                                    "active",
                                    filter === button
                                );

                            }
                        );


                    renderFeaturedProducts();

                }
            );

        }
    );


/* ================================= */
/* CART OPEN */
/* ================================= */

document
    .getElementById(
        "openCart"
    )
    .addEventListener(
        "click",
        () => {

            cartPanel.classList.add(
                "active"
            );

            overlay.classList.add(
                "active"
            );

        }
    );


/* ================================= */
/* CART CLOSE */
/* ================================= */

document
    .getElementById(
        "closeCart"
    )
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


function closeCart() {

    cartPanel.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}


/* ================================= */
/* CONTINUE SHOPPING */
/* ================================= */

document
    .getElementById(
        "continueShopping"
    )
    .addEventListener(
        "click",
        closeCart
    );


/* ================================= */
/* CHECKOUT */
/* ================================= */

checkout.addEventListener(
    "click",
    () => {

        if (
            cart.length === 0
        ) {
            return;
        }


        showToast(
            "Checkout is coming soon!"
        );

    }
);


/* ================================= */
/* TOAST */
/* ================================= */

function showToast(
    message
) {

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
        2000
    );

}


/* ================================= */
/* START */
/* ================================= */

renderFeaturedProducts();

renderFiveMProducts();

renderCart();
