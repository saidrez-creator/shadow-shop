/* =========================================================
   SHADOWSHOP SCRIPT
   ========================================================= */

const SUPABASE_URL =
  "https://ikhxliiheyxyghtcler.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_3wFAMAIs84K9aZYP8S_6Lw_-RIj19QJ";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   PRODUCTS
   ========================================================= */

const products = [

  {
    id: "tz",
    name: "TZ",
    image: "tz.png",
    prices: {
      week: 5,
      month: 15,
      year: 40,
      lifetime: 80
    }
  },

  {
    id: "tzx",
    name: "TZX",
    image: "tzx.png",
    prices: {
      week: 7,
      month: 20,
      year: 50,
      lifetime: 100
    }
  },

  {
    id: "vanity",
    name: "Vanity",
    image: "vanity.png",
    prices: {
      week: 5,
      month: 15,
      year: 45,
      lifetime: 90
    }
  },

  {
    id: "shout",
    name: "Shout",
    image: "fivem.png",
    prices: {
      week: 4,
      month: 12,
      year: 35,
      lifetime: 70
    }
  },

  {
    id: "redengine",
    name: "Read Engine",
    image: "cs2.png",
    prices: {
      week: 6,
      month: 18,
      year: 45,
      lifetime: 90
    }
  },

  {
    id: "susano",
    name: "Susano",
    image: "cheats-banner.png",
    prices: {
      week: 8,
      month: 25,
      year: 60,
      lifetime: 120
    }
  },

  {
    id: "thaigo",
    name: "Thaigo",
    image: "valorant.png",
    prices: {
      week: 5,
      month: 18,
      year: 45,
      lifetime: 90
    }
  }

];


const durationLabels = {
  week: "1 Week",
  month: "1 Month",
  year: "1 Year",
  lifetime: "Life Time"
};


/* =========================================================
   STATE
   ========================================================= */

let cart =
  JSON.parse(
    localStorage.getItem("shadow_cart") || "[]"
  );

let authMode = "login";

let currentUser = null;


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}


function money(value) {
  return "$" + Number(value).toFixed(2);
}


function toast(message) {

  const element = $("toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.shadowToast);

  window.shadowToast =
    setTimeout(() => {

      element.classList.remove("show");

    }, 2600);
}


/* =========================================================
   CART
   ========================================================= */

function saveCart() {

  localStorage.setItem(
    "shadow_cart",
    JSON.stringify(cart)
  );

  renderCart();
}


function renderCart() {

  const itemsElement =
    $("cartItems");

  const emptyElement =
    $("cartEmpty");

  if (!itemsElement || !emptyElement)
    return;


  const count =
    cart.reduce(
      (total, item) =>
        total + item.qty,
      0
    );


  $("cartCount").textContent =
    count;

  $("mobileCartCount").textContent =
    count;


  if (cart.length === 0) {

    itemsElement.innerHTML = "";

    emptyElement.style.display =
      "block";

    $("cartTotal").textContent =
      "$0.00";

    return;
  }


  emptyElement.style.display =
    "none";


  let total = 0;


  itemsElement.innerHTML =
    cart.map(
      (item, index) => {

        total +=
          item.price * item.qty;

        return `

          <div class="cart-item">

            <img
              src="${item.image}"
              alt="${item.name}"
            >

            <div>

              <div class="cart-item-title">
                ${item.name}
                ·
                ${item.duration}
              </div>

              <div class="cart-item-price">
                ${money(item.price)}
                ×
                ${item.qty}
              </div>

            </div>

            <div class="qty">

              <button
                data-minus="${index}">
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                data-plus="${index}">
                +
              </button>

            </div>

          </div>

        `;
      }
    ).join("");


  $("cartTotal").textContent =
    money(total);


  itemsElement
    .querySelectorAll("[data-minus]")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(
            button.dataset.minus
          );

        cart[index].qty--;

        if (
          cart[index].qty <= 0
        ) {

          cart.splice(index, 1);

        }

        saveCart();

      };

    });


  itemsElement
    .querySelectorAll("[data-plus]")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(
            button.dataset.plus
          );

        cart[index].qty++;

        saveCart();

      };

    });

}


function addToCart(
  product,
  duration
) {

  const price =
    product.prices[duration];


  const key =
    product.id + "-" + duration;


  const existing =
    cart.find(
      item => item.key === key
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({

      key,

      id: product.id,

      name: product.name,

      duration:
        durationLabels[duration],

      price,

      image: product.image,

      qty: 1

    });

  }


  saveCart();

  toast(
    product.name +
    " added to cart"
  );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts() {

  const grid =
    $("fivemGrid");

  if (!grid) return;


  grid.innerHTML =
    products.map(
      product => `

        <article class="product-card">

          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
          >

          <div class="product-info">

            <div class="product-category">
              FiveM Product
            </div>

            <h3 class="product-title">
              ${product.name}
            </h3>

            <div class="price-list">

              ${Object.keys(durationLabels)
                .map(
                  duration => `

                    <div class="price-option">

                      <span>
                        ${durationLabels[duration]}
                      </span>

                      <strong>
                        ${money(
                          product.prices[duration]
                        )}
                      </strong>

                    </div>

                  `
                )
                .join("")}

            </div>


            <select
              class="duration-select"
              data-duration="${product.id}"
              style="
                width:100%;
                margin-bottom:10px;
                padding:10px;
                border-radius:9px;
                background:#09080d;
                color:white;
                border:1px solid rgba(255,255,255,.1);
              "
            >

              ${Object.keys(durationLabels)
                .map(
                  duration => `

                    <option
                      value="${duration}"
                    >
                      ${durationLabels[duration]}
                      —
                      ${money(
                        product.prices[duration]
                      )}
                    </option>

                  `
                )
                .join("")}

            </select>


            <button
              class="buy-product"
              data-product="${product.id}"
              type="button"
            >
              Add to Cart
            </button>

          </div>

        </article>

      `
    ).join("");


  grid
    .querySelectorAll("[data-product]")
    .forEach(button => {

      button.onclick = () => {

        const product =
          products.find(
            item =>
              item.id ===
              button.dataset.product
          );


        const select =
          grid.querySelector(
            `[data-duration="${product.id}"]`
          );


        const duration =
          select.value;


        addToCart(
          product,
          duration
        );

      };

    });

}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {

  $("cartPanel")
    .classList.add("open");

  $("overlay")
    .classList.add("show");

}


function closeCart() {

  $("cartPanel")
    .classList.remove("open");

  $("overlay")
    .classList.remove("show");

}


/* =========================================================
   AUTH
   ========================================================= */

function openAuth(
  mode = "login"
) {

  authMode = mode;


  $("authTitle").textContent =
    mode === "login"
      ? "Login"
      : "Create Account";


  $("authSubtitle").textContent =
    mode === "login"
      ? "Login to your account."
      : "Create your ShadowShop account.";


  $("authSubmit").textContent =
    mode === "login"
      ? "Login"
      : "Create Account";


  $("authSwitchText").textContent =
    mode === "login"
      ? "Don't have an account?"
      : "Already have an account?";


  $("authSwitch").textContent =
    mode === "login"
      ? "Sign Up"
      : "Login";


  $("authMessage").textContent =
    "";

  $("authMessage").className =
    "auth-message";


  $("authOverlay")
    .classList.add("show");

}


function closeAuth() {

  $("authOverlay")
    .classList.remove("show");

}


/* =========================================================
   USER
   ========================================================= */

async function refreshUser() {

  const {
    data,
    error
  } =
    await supabaseClient.auth
      .getUser();


  if (error) {

    currentUser = null;

    return;

  }


  currentUser =
    data?.user || null;


  if (currentUser) {

    $("accountEmail").textContent =
      currentUser.email || "";

  }

}


/* =========================================================
   LOGIN / SIGN UP
   ========================================================= */

async function submitAuth(event) {

  event.preventDefault();


  const email =
    $("authEmail")
      .value
      .trim();


  const password =
    $("authPassword")
      .value;


  const message =
    $("authMessage");


  if (!email) {

    message.textContent =
      "Please enter your email.";

    message.className =
      "auth-message error";

    return;

  }


  if (password.length < 6) {

    message.textContent =
      "Password must contain at least 6 characters.";

    message.className =
      "auth-message error";

    return;

  }


  $("authSubmit").disabled =
    true;


  $("authSubmit").textContent =
    "Please wait...";


  try {

    /* ================= SIGN UP ================= */

    if (
      authMode === "signup"
    ) {

      const {
        data,
        error
      } =
        await supabaseClient.auth
          .signUp({

            email,

            password,

            options: {

              emailRedirectTo:
                window.location.origin +
                window.location.pathname

            }

          });


      if (error)
        throw error;


      if (data?.session) {

        message.textContent =
          "Account created successfully.";

        message.className =
          "auth-message success";


        await refreshUser();


        setTimeout(
          closeAuth,
          800
        );

      } else {

        message.textContent =
          "Account created. Check your email to confirm your account.";

        message.className =
          "auth-message success";

      }


    }

    /* ================= LOGIN ================= */

    else {

      const {
        error
      } =
        await supabaseClient.auth
          .signInWithPassword({

            email,

            password

          });


      if (error)
        throw error;


      message.textContent =
        "Login successful.";

      message.className =
        "auth-message success";


      await refreshUser();


      setTimeout(
        closeAuth,
        600
      );

    }


  } catch (error) {

    console.error(
      "AUTH ERROR:",
      error
    );


    /*
      IMPORTANT:
      Show the real Supabase error
      instead of only "Failed".
    */

    message.textContent =
      error?.message ||
      "Something went wrong.";


    message.className =
      "auth-message error";


  } finally {

    $("authSubmit").disabled =
      false;


    $("authSubmit").textContent =
      authMode === "login"
        ? "Login"
        : "Create Account";

  }

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

$("accountButton").onclick =
  () => {

    if (!currentUser) {

      openAuth("login");

    } else {

      $("accountPanel")
        .classList.toggle("show");

    }

  };


$("mobileAccountButton").onclick =
  () => {

    if (!currentUser) {

      openAuth("login");

    } else {

      $("accountPanel")
        .classList.toggle("show");

    }

  };


$("cartButton").onclick =
  openCart;


$("mobileCartButton").onclick =
  openCart;


$("closeCart").onclick =
  closeCart;


$("overlay").onclick =
  closeCart;


$("authClose").onclick =
  closeAuth;


$("authSwitch").onclick =
  () => {

    openAuth(
      authMode === "login"
        ? "signup"
        : "login"
    );

  };


$("authForm").addEventListener(
  "submit",
  submitAuth
);


/* =========================================================
   LOGOUT
   ========================================================= */

$("logoutButton").onclick =
  async () => {

    const {
      error
    } =
      await supabaseClient.auth
        .signOut();


    if (error) {

      toast(
        error.message
      );

      return;

    }


    currentUser = null;


    $("accountPanel")
      .classList.remove("show");


    toast(
      "Logged out successfully"
    );

  };


/* =========================================================
   FIVEM CATEGORY
   ========================================================= */

$("fivemCategory").onclick =
  () => {

    $("fivemStore")
      .classList.add("visible");


    $("fivemStore")
      .scrollIntoView({
        behavior:"smooth"
      });

  };


$("backToProducts").onclick =
  () => {

    $("fivemStore")
      .classList.remove("visible");


    $("categories")
      .scrollIntoView({
        behavior:"smooth"
      });

  };


/* =========================================================
   EXPLORE BUTTON
   ========================================================= */

$("exploreProducts").onclick =
  () => {

    $("fivemStore")
      .classList.add("visible");


    $("fivemStore")
      .scrollIntoView({
        behavior:"smooth"
      });

  };


/* =========================================================
   MOBILE HOME
   ========================================================= */

$("mobileHomeButton").onclick =
  () => {

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  };


$("mobileMenuButton").onclick =
  () => {

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  };


/* =========================================================
   CHECKOUT
   ========================================================= */

$("checkoutButton").onclick =
  () => {

    if (!currentUser) {

      closeCart();

      openAuth("login");

      toast(
        "Login first to continue"
      );

      return;

    }


    toast(
      "Checkout will be connected next."
    );

  };


/* =========================================================
   SUPABASE AUTH STATE
   ========================================================= */

supabaseClient.auth
  .onAuthStateChange(
    async () => {

      await refreshUser();

    }
  );


/* =========================================================
   START
   ========================================================= */

renderProducts();

renderCart();

refreshUser();
