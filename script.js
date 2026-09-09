/* =========================================================
   SHADOW SHOP — SCRIPT.JS
   ========================================================= */

/* =========================================================
   SUPABASE
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

const featuredProducts = [
  {
    id: "cs2-premium",
    name: "CS2 Premium",
    category: "CS2",
    price: 19.99,
    image: "cs2.png",
    description:
      "Premium digital gaming access for CS2."
  },

  {
    id: "valorant-premium",
    name: "Valorant Premium",
    category: "Valorant",
    price: 19.99,
    image: "valorant.png",
    description:
      "Premium digital gaming access for Valorant."
  },

  {
    id: "gaming-gift-card",
    name: "Gaming Gift Card",
    category: "Gift Cards",
    price: 25,
    image: "logo.png",
    description:
      "Digital gaming gift card."
  },

  {
    id: "premium-membership",
    name: "Premium Membership",
    category: "Memberships",
    price: 29.99,
    image: "logo.png",
    description:
      "Premium Shadow Shop membership."
  }
];

/* =========================================================
   FIVEM PRODUCTS
   ========================================================= */

const fivemProducts = [
  {
    id: "tzx",
    name: "TZX",
    category: "FiveM",
    image: "fivem.png",
    description:
      "FiveM digital product.",

    durations: [
      {
        label: "1 Day",
        price: 5
      },
      {
        label: "7 Days",
        price: 15
      },
      {
        label: "30 Days",
        price: 30
      }
    ]
  },

  {
    id: "redengine",
    name: "RedEngine",
    category: "FiveM",
    image: "fivem.png",
    description:
      "FiveM digital product.",

    durations: [
      {
        label: "1 Day",
        price: 5
      },
      {
        label: "7 Days",
        price: 18
      },
      {
        label: "30 Days",
        price: 35
      }
    ]
  },

  {
    id: "taigo",
    name: "Taigo",
    category: "FiveM",
    image: "fivem.png",
    description:
      "FiveM digital product.",

    durations: [
      {
        label: "1 Day",
        price: 5
      },
      {
        label: "7 Days",
        price: 17
      },
      {
        label: "30 Days",
        price: 32
      }
    ]
  }
];

/* =========================================================
   DOM
   ========================================================= */

const productsGrid =
  document.getElementById("productsGrid");

const fivemGrid =
  document.getElementById("fivemGrid");

const emptyProducts =
  document.getElementById("emptyProducts");

const searchInput =
  document.getElementById("searchInput");

const filterButtons =
  document.querySelectorAll(".filter-button");

const cartButton =
  document.getElementById("cartButton");

const cartCount =
  document.getElementById("cartCount");

const overlay =
  document.getElementById("overlay");

const cartPanel =
  document.getElementById("cartPanel");

const closeCart =
  document.getElementById("closeCart");

const cartItems =
  document.getElementById("cartItems");

const cartEmpty =
  document.getElementById("cartEmpty");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutButton =
  document.getElementById("checkoutButton");

const toast =
  document.getElementById("toast");

const fivemStore =
  document.getElementById("fivemStore");

const backToProducts =
  document.getElementById("backToProducts");

const accountButton =
  document.getElementById("accountButton");

const accountButtonText =
  document.getElementById("accountButtonText");

const authOverlay =
  document.getElementById("authOverlay");

const authClose =
  document.getElementById("authClose");

const authTitle =
  document.getElementById("authTitle");

const authSubtitle =
  document.getElementById("authSubtitle");

const authForm =
  document.getElementById("authForm");

const authEmail =
  document.getElementById("authEmail");

const authPassword =
  document.getElementById("authPassword");

const authSubmit =
  document.getElementById("authSubmit");

const authSwitch =
  document.getElementById("authSwitch");

const authMessage =
  document.getElementById("authMessage");

const accountPanel =
  document.getElementById("accountPanel");

const accountEmail =
  document.getElementById("accountEmail");

const logoutButton =
  document.getElementById("logoutButton");

/* =========================================================
   STATE
   ========================================================= */

let cart = [];

let currentFilter = "All";

let authMode = "login";

let currentUser = null;

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadCart() {
  try {
    const saved =
      localStorage.getItem(
        "shadowShopCart"
      );

    if (!saved) return;

    const parsed =
      JSON.parse(saved);

    if (Array.isArray(parsed)) {
      cart = parsed;
    }
  } catch (error) {
    console.error(
      "Cart loading error:",
      error
    );

    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(
      "shadowShopCart",
      JSON.stringify(cart)
    );
  } catch (error) {
    console.error(
      "Cart saving error:",
      error
    );
  }
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {
      toast.classList.remove(
        "show"
      );
    }, 2800);
}

/* =========================================================
   PRODUCT HELPERS
   ========================================================= */

function getAllProducts() {
  const fivem =
    fivemProducts.map(
      (product) => ({
        ...product,

        price:
          product.durations?.[0]
            ?.price || 0
      })
    );

  return [
    ...featuredProducts,
    ...fivem
  ];
}

function findProduct(productId) {
  return getAllProducts().find(
    (product) =>
      product.id === productId
  );
}

/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {
  if (!productsGrid) return;

  const query =
    searchInput?.value
      .trim()
      .toLowerCase() || "";

  const filtered =
    featuredProducts.filter(
      (product) => {
        const matchesFilter =
          currentFilter === "All" ||
          product.category ===
            currentFilter;

        const searchableText = `
          ${product.name}
          ${product.category}
          ${product.description}
        `.toLowerCase();

        const matchesSearch =
          !query ||
          searchableText.includes(
            query
          );

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );

  productsGrid.innerHTML = "";

  if (filtered.length === 0) {
    if (emptyProducts) {
      emptyProducts.classList.add(
        "show"
      );
    }

    return;
  }

  if (emptyProducts) {
    emptyProducts.classList.remove(
      "show"
    );
  }

  filtered.forEach(
    (product) => {
      const card =
        document.createElement(
          "article"
        );

      card.className =
        "product-card";

      card.innerHTML = `
        <div class="product-image">

          <span class="product-badge">
            ${escapeHtml(
              product.category
            )}
          </span>

          <img
            src="${escapeHtml(
              product.image
            )}"
            alt="${escapeHtml(
              product.name
            )}"
            loading="lazy"
          >

        </div>

        <div class="product-content">

          <span class="product-category">
            ${escapeHtml(
              product.category
            )}
          </span>

          <h3>
            ${escapeHtml(
              product.name
            )}
          </h3>

          <p>
            ${escapeHtml(
              product.description
            )}
          </p>

          <div class="product-bottom">

            <strong class="product-price">
              ${formatPrice(
                product.price
              )}
            </strong>

            <button
              type="button"
              class="add-to-cart"
              data-product-id="${escapeHtml(
                product.id
              )}"
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
}

/* =========================================================
   FIVEM MARKETPLACE
   ========================================================= */

function renderFivemProducts() {
  if (!fivemGrid) return;

  fivemGrid.innerHTML = "";

  fivemProducts.forEach(
    (product) => {
      const card =
        document.createElement(
          "article"
        );

      card.className =
        "product-card";

      const durations =
        product.durations || [];

      card.innerHTML = `
        <div class="product-image">

          <span class="product-badge">
            FIVEM
          </span>

          <img
            src="${escapeHtml(
              product.image
            )}"
            alt="${escapeHtml(
              product.name
            )}"
            loading="lazy"
          >

        </div>

        <div class="product-content">

          <span class="product-category">
            FiveM Marketplace
          </span>

          <h3>
            ${escapeHtml(
              product.name
            )}
          </h3>

          <p>
            ${escapeHtml(
              product.description
            )}
          </p>

          <div class="duration-options">

            ${durations
              .map(
                (duration, index) => `
                  <button
                    type="button"
                    class="duration-button ${
                      index === 0
                        ? "active"
                        : ""
                    }"
                    data-product-id="${escapeHtml(
                      product.id
                    )}"
                    data-duration-index="${index}"
                  >
                    ${escapeHtml(
                      duration.label
                    )}
                    ·
                    ${formatPrice(
                      duration.price
                    )}
                  </button>
                `
              )
              .join("")}

          </div>

          <div class="product-bottom">

            <strong
              class="product-price"
              data-fivem-price="${escapeHtml(
                product.id
              )}"
            >
              ${formatPrice(
                durations[0]?.price ||
                  0
              )}
            </strong>

            <button
              type="button"
              class="add-to-cart fivem-add"
              data-product-id="${escapeHtml(
                product.id
              )}"
              data-duration-index="0"
            >
              Add to Cart
            </button>

          </div>

        </div>
      `;

      fivemGrid.appendChild(
        card
      );
    }
  );
}

/* =========================================================
   CART FUNCTIONS
   ========================================================= */

function addToCart(
  productId,
  durationIndex = null
) {
  const product =
    findProduct(productId);

  if (!product) {
    showToast(
      "Product not found."
    );

    return;
  }

  let name =
    product.name;

  let price =
    Number(product.price || 0);

  let duration = "";

  if (
    product.category ===
      "FiveM" &&
    Array.isArray(
      product.durations
    )
  ) {
    const selected =
      product.durations[
        Number(durationIndex) || 0
      ];

    if (selected) {
      price =
        Number(
          selected.price
        );

      duration =
        selected.label;

      name =
        `${product.name} — ${selected.label}`;
    }
  }

  const existing =
    cart.find(
      (item) =>
        item.productId ===
          productId &&
        item.duration ===
          duration
    );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId,
      name,
      price,
      image:
        product.image,
      category:
        product.category,
      duration,
      quantity: 1
    });
  }

  saveCart();

  renderCart();

  showToast(
    `${name} added to cart.`
  );
}

function removeFromCart(index) {
  if (
    index < 0 ||
    index >= cart.length
  ) {
    return;
  }

  cart.splice(index, 1);

  saveCart();

  renderCart();
}

function changeQuantity(
  index,
  change
) {
  if (!cart[index]) return;

  cart[index].quantity +=
    change;

  if (
    cart[index].quantity <=
    0
  ) {
    cart.splice(index, 1);
  }

  saveCart();

  renderCart();
}

function getCartCount() {
  return cart.reduce(
    (total, item) =>
      total +
      Number(
        item.quantity || 0
      ),
    0
  );
}

function getCartTotal() {
  return cart.reduce(
    (total, item) =>
      total +
      Number(
        item.price || 0
      ) *
        Number(
          item.quantity || 0
        ),
    0
  );
}

/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {
  if (!cartItems) return;

  const count =
    getCartCount();

  const total =
    getCartTotal();

  if (cartCount) {
    cartCount.textContent =
      count;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = "";

    if (cartEmpty) {
      cartEmpty.style.display =
        "block";
    }
  } else {
    if (cartEmpty) {
      cartEmpty.style.display =
        "none";
    }

    cartItems.innerHTML =
      cart
        .map(
          (item, index) => `
            <div class="cart-item">

              <div class="cart-item-image">
                <img
                  src="${escapeHtml(
                    item.image
                  )}"
                  alt="${escapeHtml(
                    item.name
                  )}"
                >
              </div>

              <div>

                <h4>
                  ${escapeHtml(
                    item.name
                  )}
                </h4>

                ${
                  item.duration
                    ? `
                      <p>
                        ${escapeHtml(
                          item.duration
                        )}
                      </p>
                    `
                    : ""
                }

                <div class="quantity-controls">

                  <button
                    type="button"
                    data-cart-action="decrease"
                    data-cart-index="${index}"
                  >
                    −
                  </button>

                  <span>
                    ${Number(
                      item.quantity
                    )}
                  </span>

                  <button
                    type="button"
                    data-cart-action="increase"
                    data-cart-index="${index}"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    data-cart-action="remove"
                    data-cart-index="${index}"
                  >
                    ×
                  </button>

                </div>

              </div>

              <div class="cart-item-price">
                ${formatPrice(
                  Number(
                    item.price
                  ) *
                    Number(
                      item.quantity
                    )
                )}
              </div>

            </div>
          `
        )
        .join("");
  }

  if (cartTotal) {
    cartTotal.textContent =
      formatPrice(total);
  }
}

/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {
  overlay?.classList.add(
    "active"
  );

  cartPanel?.classList.add(
    "active"
  );

  document.body.classList.add(
    "modal-open"
  );
}

function closeCartPanel() {
  overlay?.classList.remove(
    "active"
  );

  cartPanel?.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "modal-open"
  );
}

/* =========================================================
   FIVEM NAVIGATION
   ========================================================= */

function openFivemStore() {
  fivemStore?.classList.add(
    "active"
  );

  const productsSection =
    document.getElementById(
      "products"
    );

  if (productsSection) {
    productsSection.style.display =
      "none";
  }

  fivemStore?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeFivemStore() {
  fivemStore?.classList.remove(
    "active"
  );

  const productsSection =
    document.getElementById(
      "products"
    );

  if (productsSection) {
    productsSection.style.display =
      "";
  }

  productsSection?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(
  message
) {
  if (!authMessage) return;

  authMessage.textContent =
    message;

  authMessage.classList.add(
    "show"
  );
}

function clearAuthMessage() {
  if (!authMessage) return;

  authMessage.textContent = "";

  authMessage.classList.remove(
    "show"
  );
}

/* =========================================================
   AUTH MODE
   ========================================================= */

function setAuthMode(mode) {
  authMode = mode;

  clearAuthMessage();

  if (authMode === "signup") {
    if (authTitle) {
      authTitle.textContent =
        "Create Account";
    }

    if (authSubtitle) {
      authSubtitle.textContent =
        "Create your Shadow Shop account.";
    }

    if (authSubmit) {
      authSubmit.textContent =
        "Create Account";
    }

    if (authSwitch) {
      authSwitch.innerHTML = `
        Already have an account?
        <button
          type="button"
          id="authSwitchButton"
        >
          Login
        </button>
      `;
    }
  } else {
    if (authTitle) {
      authTitle.textContent =
        "Welcome Back";
    }

    if (authSubtitle) {
      authSubtitle.textContent =
        "Login to your Shadow Shop account.";
    }

    if (authSubmit) {
      authSubmit.textContent =
        "Login";
    }

    if (authSwitch) {
      authSwitch.innerHTML = `
        Don't have an account?
        <button
          type="button"
          id="authSwitchButton"
        >
          Create Account
        </button>
      `;
    }
  }

  const switchButton =
    document.getElementById(
      "authSwitchButton"
    );

  switchButton?.addEventListener(
    "click",
    () => {
      setAuthMode(
        authMode === "login"
          ? "signup"
          : "login"
      );
    }
  );
}

/* =========================================================
   OPEN / CLOSE AUTH
   ========================================================= */

function openAuth(
  mode = "login"
) {
  setAuthMode(mode);

  authOverlay?.classList.add(
    "active"
  );

  accountPanel?.classList.remove(
    "active"
  );

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(() => {
    authEmail?.focus();
  }, 100);
}

function closeAuth() {
  authOverlay?.classList.remove(
    "active"
  );

  document.body.classList.remove(
    "modal-open"
  );

  clearAuthMessage();
}

/* =========================================================
   ACCOUNT UI
   ========================================================= */

function updateAccountUI(user) {
  currentUser =
    user || null;

  if (accountButtonText) {
    accountButtonText.textContent =
      currentUser
        ? "Account"
        : "Login";
  }

  if (accountEmail) {
    accountEmail.textContent =
      currentUser?.email || "";
  }
}

function toggleAccountPanel() {
  if (!currentUser) {
    openAuth("login");
    return;
  }

  if (!accountPanel) return;

  accountPanel.classList.toggle(
    "active"
  );

  if (
    accountPanel.classList.contains(
      "active"
    )
  ) {
    accountEmail.textContent =
      currentUser.email || "";
  }
}

/* =========================================================
   GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {
  try {
    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {
      updateAccountUI(null);
      return null;
    }

    updateAccountUI(
      data?.user || null
    );

    return (
      data?.user || null
    );
  } catch (error) {
    console.error(
      "User error:",
      error
    );

    updateAccountUI(null);

    return null;
  }
}

/* =========================================================
   LOGIN / SIGNUP
   ========================================================= */

async function handleAuthSubmit(
  event
) {
  event.preventDefault();

  clearAuthMessage();

  const email =
    authEmail?.value
      .trim() || "";

  const password =
    authPassword?.value || "";

  if (!email || !password) {
    showAuthMessage(
      "Please enter your email and password."
    );

    return;
  }

  if (password.length < 6) {
    showAuthMessage(
      "Password must contain at least 6 characters."
    );

    return;
  }

  if (authSubmit) {
    authSubmit.disabled =
      true;

    authSubmit.textContent =
      authMode === "signup"
        ? "Creating..."
        : "Logging in...";
  }

  try {
    if (
      authMode === "signup"
    ) {
      const redirectUrl =
        window.location.origin +
        window.location.pathname;

      const {
        data,
        error
      } =
        await supabaseClient.auth.signUp(
          {
            email,
            password,

            options: {
              emailRedirectTo:
                redirectUrl
            }
          }
        );

      if (error) {
        throw error;
      }

      if (data?.session) {
        updateAccountUI(
          data.user
        );

        showToast(
          "Account created successfully."
        );

        closeAuth();
      } else {
        showAuthMessage(
          "Account created. Check your email to confirm your account."
        );
      }
    } else {
      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword(
          {
            email,
            password
          }
        );

      if (error) {
        throw error;
      }

      updateAccountUI(
        data?.user || null
      );

      showToast(
        "Logged in successfully."
      );

      closeAuth();
    }
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    let message =
      error?.message ||
      "Something went wrong.";

    const lower =
      message.toLowerCase();

    if (
      lower.includes(
        "invalid login credentials"
      )
    ) {
      message =
        "Incorrect email or password.";
    }

    if (
      lower.includes(
        "email not confirmed"
      )
    ) {
      message =
        "Please confirm your email before logging in.";
    }

    if (
      lower.includes(
        "user already registered"
      )
    ) {
      message =
        "This email is already registered. Try logging in.";
    }

    showAuthMessage(message);
  } finally {
    if (authSubmit) {
      authSubmit.disabled =
        false;

      authSubmit.textContent =
        authMode === "signup"
          ? "Create Account"
          : "Login";
    }
  }
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout() {
  try {
    const {
      error
    } =
      await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    updateAccountUI(null);

    accountPanel?.classList.remove(
      "active"
    );

    showToast(
      "Logged out successfully."
    );
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    showToast(
      "Could not log out."
    );
  }
}

/* =========================================================
   PRODUCT EVENTS
   ========================================================= */

productsGrid?.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        ".add-to-cart"
      );

    if (!button) return;

    addToCart(
      button.dataset.productId
    );
  }
);

/* =========================================================
   FIVEM EVENTS
   ========================================================= */

fivemGrid?.addEventListener(
  "click",
  (event) => {
    const durationButton =
      event.target.closest(
        ".duration-button"
      );

    if (durationButton) {
      const productId =
        durationButton.dataset
          .productId;

      const durationIndex =
        Number(
          durationButton
            .dataset
            .durationIndex
        );

      const product =
        fivemProducts.find(
          (item) =>
            item.id === productId
        );

      if (!product) return;

      const selected =
        product.durations?.[
          durationIndex
        ];

      if (!selected) return;

      const card =
        durationButton.closest(
          ".product-card"
        );

      card
        ?.querySelectorAll(
          ".duration-button"
        )
        .forEach(
          (button) => {
            button.classList.remove(
              "active"
            );
          }
        );

      durationButton.classList.add(
        "active"
      );

      const priceElement =
        card?.querySelector(
          `[data-fivem-price="${productId}"]`
        );

      if (priceElement) {
        priceElement.textContent =
          formatPrice(
            selected.price
          );
      }

      const addButton =
        card?.querySelector(
          ".fivem-add"
        );

      if (addButton) {
        addButton.dataset
          .durationIndex =
          String(
            durationIndex
          );
      }

      return;
    }

    const addButton =
      event.target.closest(
        ".fivem-add"
      );

    if (!addButton) return;

    addToCart(
      addButton.dataset
        .productId,

      Number(
        addButton.dataset
          .durationIndex || 0
      )
    );
  }
);

/* =========================================================
   FILTERS
   ========================================================= */

filterButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        filterButtons.forEach(
          (item) => {
            item.classList.remove(
              "active"
            );
          }
        );

        button.classList.add(
          "active"
        );

        currentFilter =
          button.dataset
            .filter ||
          button.textContent
            .trim() ||
          "All";

        renderProducts();
      }
    );
  }
);

/* =========================================================
   SEARCH
   ========================================================= */

searchInput?.addEventListener(
  "input",
  renderProducts
);

/* =========================================================
   CART EVENTS
   ========================================================= */

cartButton?.addEventListener(
  "click",
  openCart
);

closeCart?.addEventListener(
  "click",
  closeCartPanel
);

overlay?.addEventListener(
  "click",
  closeCartPanel
);

cartItems?.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-cart-action]"
      );

    if (!button) return;

    const index =
      Number(
        button.dataset
          .cartIndex
      );

    const action =
      button.dataset
        .cartAction;

    if (
      action ===
      "increase"
    ) {
      changeQuantity(
        index,
        1
      );
    }

    if (
      action ===
      "decrease"
    ) {
      changeQuantity(
        index,
        -1
      );
    }

    if (
      action === "remove"
    ) {
      removeFromCart(index);
    }
  }
);

/* =========================================================
   FIVEM BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    '[data-category="FiveM"]'
  )
  .forEach(
    (button) => {
      button.addEventListener(
        "click",
        openFivemStore
      );
    }
  );

backToProducts?.addEventListener(
  "click",
  closeFivemStore
);

/* =========================================================
   AUTH EVENTS
   ========================================================= */

accountButton?.addEventListener(
  "click",
  toggleAccountPanel
);

authClose?.addEventListener(
  "click",
  closeAuth
);

authOverlay?.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      authOverlay
    ) {
      closeAuth();
    }
  }
);

authForm?.addEventListener(
  "submit",
  handleAuthSubmit
);

logoutButton?.addEventListener(
  "click",
  handleLogout
);

/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key !==
      "Escape"
    ) {
      return;
    }

    closeCartPanel();

    closeAuth();

    accountPanel?.classList.remove(
      "active"
    );
  }
);

/* =========================================================
   OUTSIDE ACCOUNT
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {
    if (
      !accountPanel ||
      !accountButton
    ) {
      return;
    }

    if (
      !accountPanel.contains(
        event.target
      ) &&
      !accountButton.contains(
        event.target
      )
    ) {
      accountPanel.classList.remove(
        "active"
      );
    }
  }
);

/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutButton?.addEventListener(
  "click",
  () => {
    if (cart.length === 0) {
      showToast(
        "Your cart is empty."
      );

      return;
    }

    if (!currentUser) {
      showToast(
        "Please login before checkout."
      );

      closeCartPanel();

      openAuth("login");

      return;
    }

    showToast(
      "Checkout is coming soon!"
    );
  }
);

/* =========================================================
   SUPABASE AUTH STATE
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
  (_event, session) => {
    updateAccountUI(
      session?.user || null
    );
  }
);

/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeShadowShop() {
  loadCart();

  renderProducts();

  renderFivemProducts();

  renderCart();

  getCurrentUser();
}

initializeShadowShop();

/* =========================================================
   END
   ========================================================= */