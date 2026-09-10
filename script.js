const SUPABASE_URL =
  "https://ikhxliiheyxyghtcler.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_3wFAMAIs84K9aZYP8S_6Lw_-RIj19QJ";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// PRODUCTS

const products = [
  {
    id: "7tz",
    name: "7 TZ",
    image: "fivem.png",
    prices: {
      "1 Week": 5,
      "1 Month": 15,
      "1 Year": 40,
      "Life Time": 80
    }
  },

  {
    id: "tzx",
    name: "TZX",
    image: "fivem-banner.png",
    prices: {
      "1 Week": 7,
      "1 Month": 20,
      "1 Year": 50,
      "Life Time": 100
    }
  },

  {
    id: "vanity",
    name: "Vanity",
    image: "banner.jpg",
    prices: {
      "1 Week": 5,
      "1 Month": 15,
      "1 Year": 45,
      "Life Time": 90
    }
  },

  {
    id: "shout",
    name: "Shout",
    image: "fivem.png",
    prices: {
      "1 Week": 4,
      "1 Month": 12,
      "1 Year": 35,
      "Life Time": 70
    }
  },

  {
    id: "read-engine",
    name: "Read Engine",
    image: "cs2.png",
    prices: {
      "1 Week": 6,
      "1 Month": 18,
      "1 Year": 45,
      "Life Time": 90
    }
  },

  {
    id: "susano",
    name: "Susano",
    image: "cheats-banner.png",
    prices: {
      "1 Week": 8,
      "1 Month": 25,
      "1 Year": 60,
      "Life Time": 120
    }
  },

  {
    id: "thaigo",
    name: "Thaigo",
    image: "valorant.png",
    prices: {
      "1 Week": 5,
      "1 Month": 18,
      "1 Year": 45,
      "Life Time": 90
    }
  }
];


let cart = JSON.parse(
  localStorage.getItem("shadowshop_cart") || "[]"
);


// ELEMENTS

const fivemCategory =
  document.getElementById("fivemCategory");

const fivemStore =
  document.getElementById("fivemStore");

const fivemGrid =
  document.getElementById("fivemGrid");

const backToProducts =
  document.getElementById("backToProducts");

const exploreProducts =
  document.getElementById("exploreProducts");

const cartButton =
  document.getElementById("cartButton");

const mobileCartButton =
  document.getElementById("mobileCartButton");

const closeCart =
  document.getElementById("closeCart");

const cartPanel =
  document.getElementById("cartPanel");

const overlay =
  document.getElementById("overlay");

const cartItems =
  document.getElementById("cartItems");

const cartEmpty =
  document.getElementById("cartEmpty");

const cartTotal =
  document.getElementById("cartTotal");

const cartCount =
  document.getElementById("cartCount");

const mobileCartCount =
  document.getElementById("mobileCartCount");

const checkoutButton =
  document.getElementById("checkoutButton");

const accountButton =
  document.getElementById("accountButton");

const mobileAccountButton =
  document.getElementById("mobileAccountButton");

const mobileHomeButton =
  document.getElementById("mobileHomeButton");

const authOverlay =
  document.getElementById("authOverlay");

const authClose =
  document.getElementById("authClose");

const authForm =
  document.getElementById("authForm");

const authEmail =
  document.getElementById("authEmail");

const authPassword =
  document.getElementById("authPassword");

const authSubmit =
  document.getElementById("authSubmit");

const authTitle =
  document.getElementById("authTitle");

const authSubtitle =
  document.getElementById("authSubtitle");

const authSwitch =
  document.getElementById("authSwitch");

const authSwitchText =
  document.getElementById("authSwitchText");

const authMessage =
  document.getElementById("authMessage");

const accountPanel =
  document.getElementById("accountPanel");

const accountEmail =
  document.getElementById("accountEmail");

const logoutButton =
  document.getElementById("logoutButton");

const toast =
  document.getElementById("toast");


// AUTH MODE

let authMode = "login";


// PRODUCTS RENDER

function renderProducts() {

  fivemGrid.innerHTML = "";

  products.forEach(product => {

    const durations =
      Object.keys(product.prices);

    const card =
      document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
      >

      <div class="product-body">

        <h3>${product.name}</h3>

        <p>
          FiveM product
        </p>

        <select class="duration-select">

          ${durations.map(duration => `
            <option value="${duration}">
              ${duration} — $${product.prices[duration]}
            </option>
          `).join("")}

        </select>

        <div class="product-bottom">

          <span class="product-price">
            $${product.prices[durations[0]]}
          </span>

          <button
            class="add-cart-btn"
            data-id="${product.id}"
          >
            Add to Cart
          </button>

        </div>

      </div>
    `;

    const select =
      card.querySelector(".duration-select");

    const price =
      card.querySelector(".product-price");

    select.addEventListener("change", () => {

      price.textContent =
        "$" + product.prices[select.value];

    });

    card
      .querySelector(".add-cart-btn")
      .addEventListener("click", () => {

        addToCart(
          product,
          select.value
        );

      });

    fivemGrid.appendChild(card);

  });
}


// CATEGORY

fivemCategory.addEventListener(
  "click",
  () => {

    fivemStore.classList.add("visible");

    fivemStore.scrollIntoView({
      behavior: "smooth"
    });

  }
);


backToProducts.addEventListener(
  "click",
  () => {

    fivemStore.classList.remove("visible");

    document
      .getElementById("categories")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


exploreProducts.addEventListener(
  "click",
  () => {

    document
      .getElementById("categories")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


// CART

function saveCart() {

  localStorage.setItem(
    "shadowshop_cart",
    JSON.stringify(cart)
  );

}


function addToCart(
  product,
  duration
) {

  const item = {
    id: Date.now(),
    productId: product.id,
    name: product.name,
    duration: duration,
    price: product.prices[duration]
  };

  cart.push(item);

  saveCart();

  renderCart();

  showToast(
    `${product.name} added to cart`
  );

}


function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);

  saveCart();

  renderCart();

}


function renderCart() {

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartEmpty.style.display = "block";

  } else {

    cartEmpty.style.display = "none";

    cart.forEach(item => {

      const div =
        document.createElement("div");

      div.className = "cart-item";

      div.innerHTML = `
        <div>
          <h4>${item.name}</h4>

          <small>
            ${item.duration}
          </small>
        </div>

        <div>
          <strong>
            $${item.price}
          </strong>

          <button
            class="remove-cart"
            data-id="${item.id}"
          >
            ×
          </button>
        </div>
      `;

      div
        .querySelector(".remove-cart")
        .addEventListener(
          "click",
          () => removeFromCart(item.id)
        );

      cartItems.appendChild(div);

    });

  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum + Number(item.price),
      0
    );

  cartTotal.textContent =
    total.toFixed(2);

  cartCount.textContent =
    cart.length;

  mobileCartCount.textContent =
    cart.length;

}


function openCart() {

  cartPanel.classList.add("active");

  overlay.classList.add("active");

}


function closeCartPanel() {

  cartPanel.classList.remove("active");

  overlay.classList.remove("active");

}


cartButton.addEventListener(
  "click",
  openCart
);

mobileCartButton.addEventListener(
  "click",
  openCart
);

closeCart.addEventListener(
  "click",
  closeCartPanel
);

overlay.addEventListener(
  "click",
  closeCartPanel
);


// AUTH

function openAuth(mode = "login") {

  authMode = mode;

  authOverlay.classList.add("active");

  authMessage.textContent = "";

  if (mode === "login") {

    authTitle.textContent =
      "Login";

    authSubtitle.textContent =
      "Login to your account.";

    authSubmit.textContent =
      "Login";

    authSwitchText.textContent =
      "Don't have an account?";

    authSwitch.textContent =
      "Create Account";

  } else {

    authTitle.textContent =
      "Create Account";

    authSubtitle.textContent =
      "Create your ShadowShop account.";

    authSubmit.textContent =
      "Create Account";

    authSwitchText.textContent =
      "Already have an account?";

    authSwitch.textContent =
      "Login";

  }

}


function closeAuth() {

  authOverlay.classList.remove("active");

}


accountButton.addEventListener(
  "click",
  async () => {

    const {
      data
    } = await supabaseClient.auth.getUser();

    if (data.user) {

      accountEmail.textContent =
        data.user.email;

      accountPanel.classList.toggle(
        "active"
      );

    } else {

      openAuth("login");

    }

  }
);


mobileAccountButton.addEventListener(
  "click",
  async () => {

    const {
      data
    } = await supabaseClient.auth.getUser();

    if (data.user) {

      accountEmail.textContent =
        data.user.email;

      accountPanel.classList.toggle(
        "active"
      );

    } else {

      openAuth("login");

    }

  }
);


authClose.addEventListener(
  "click",
  closeAuth
);


authSwitch.addEventListener(
  "click",
  () => {

    if (authMode === "login") {

      openAuth("signup");

    } else {

      openAuth("login");

    }

  }
);


// LOGIN / SIGNUP

authForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const email =
      authEmail.value.trim();

    const password =
      authPassword.value;

    authSubmit.disabled = true;

    authMessage.textContent =
      "Please wait...";


    try {

      if (authMode === "login") {

        const {
          error
        } =
          await supabaseClient.auth.signInWithPassword({
            email,
            password
          });

        if (error) {
          throw error;
        }

        authMessage.textContent =
          "Login successful.";

        setTimeout(() => {

          closeAuth();

        }, 700);


      } else {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signUp({

            email,
            password,

            options: {

              emailRedirectTo:
                window.location.origin +
                window.location.pathname

            }

          });

        if (error) {
          throw error;
        }


        if (data.session) {

          authMessage.textContent =
            "Account created successfully.";

        } else {

          authMessage.textContent =
            "Account created. Check your email to confirm your account.";

        }

      }

    } catch (error) {

      authMessage.textContent =
        error.message || "Something went wrong.";

    }


    authSubmit.disabled = false;

  }
);


// LOGOUT

logoutButton.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    accountPanel.classList.remove(
      "active"
    );

    showToast(
      "Logged out successfully"
    );

  }
);


// CHECKOUT

checkoutButton.addEventListener(
  "click",
  async () => {

    if (cart.length === 0) {

      showToast(
        "Your cart is empty"
      );

      return;

    }


    const {
      data
    } =
      await supabaseClient.auth.getUser();


    if (!data.user) {

      closeCartPanel();

      openAuth("login");

      return;

    }


    showToast(
      "Checkout will be connected next."
    );

  }
);


// MOBILE HOME

mobileHomeButton.addEventListener(
  "click",
  () => {

    document
      .getElementById("home")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


// TOAST

let toastTimer;

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2500);

}


// INIT

renderProducts();

renderCart();


// SUPABASE SESSION

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    if (session?.user) {

      accountEmail.textContent =
        session.user.email;

    }

  }
);
