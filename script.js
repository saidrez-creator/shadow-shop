const products = [
  {
    id: 1,
    name: "EA Sports FC 26",
    category: "games",
    price: 8900,
    emoji: "⚽",
    desc: "PC • Digital Key",
    badge: "HOT"
  },

  {
    id: 2,
    name: "Steam Wallet 20€",
    category: "cards",
    price: 4200,
    emoji: "🎴",
    desc: "Global • Instant Delivery",
    badge: "NEW"
  },

  {
    id: 3,
    name: "PlayStation Plus",
    category: "subscriptions",
    price: 7600,
    emoji: "🎮",
    desc: "12 Months • PS5/PS4",
    badge: "TOP"
  },

  {
    id: 4,
    name: "Game Pass Ultimate",
    category: "subscriptions",
    price: 6900,
    emoji: "🟩",
    desc: "1 Month • Xbox / PC",
    badge: ""
  },

  {
    id: 5,
    name: "Valorant Points 2050",
    category: "cards",
    price: 5100,
    emoji: "🎯",
    desc: "Riot Games • Instant",
    badge: ""
  },

  {
    id: 6,
    name: "Minecraft Java & Bedrock",
    category: "games",
    price: 8400,
    emoji: "⛏️",
    desc: "PC • Microsoft Account",
    badge: ""
  },

  {
    id: 7,
    name: "Discord Nitro",
    category: "subscriptions",
    price: 3500,
    emoji: "💬",
    desc: "1 Month • Digital",
    badge: ""
  },

  {
    id: 8,
    name: "Gift Card Service",
    category: "services",
    price: 1500,
    emoji: "⚡",
    desc: "Custom Amount • Fast",
    badge: ""
  }
];


let cart = JSON.parse(
  localStorage.getItem("shadowCart") || "[]"
);

let filter = "all";


const grid =
  document.getElementById("productsGrid");

const search =
  document.getElementById("searchInput");

const cartPanel =
  document.getElementById("cartPanel");

const overlay =
  document.getElementById("overlay");

const cartItems =
  document.getElementById("cartItems");

const cartCount =
  document.getElementById("cartCount");

const cartTotal =
  document.getElementById("cartTotal");

const toast =
  document.getElementById("toast");


function money(number) {

  return new Intl.NumberFormat(
    "fr-FR"
  ).format(number) + " DA";

}



function renderProducts() {

  const query =
    search.value
      .trim()
      .toLowerCase();


  const shown =
    products.filter(product => {

      const categoryMatch =
        filter === "all" ||
        product.category === filter;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(query);

      return categoryMatch &&
        searchMatch;

    });


  if (!shown.length) {

    grid.innerHTML = `
      <p style="
        color:#9299a8;
        grid-column:1/-1;
      ">
        ما لقيناش منتجات مطابقة.
      </p>
    `;

    return;
  }


  grid.innerHTML =
    shown.map(product => {

      return `
        <article class="product">

          <div class="product-img">

            <span>
              ${product.emoji}
            </span>

            ${
              product.badge
              ?
              `
              <span class="badge">
                ${product.badge}
              </span>
              `
              :
              ""
            }

          </div>


          <div class="product-info">

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.desc}
            </p>


            <div class="price-row">

              <span class="price">
                ${money(product.price)}
              </span>

              <button
                class="add"
                data-id="${product.id}"
                aria-label="أضف للسلة"
              >
                +
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");


  document
    .querySelectorAll(".add")
    .forEach(button => {

      button.onclick = () => {

        addToCart(
          Number(button.dataset.id)
        );

      };

    });

}



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

    existing.qty++;

  } else {

    cart.push({
      ...product,
      qty: 1
    });

  }


  saveCart();

  renderCart();

  showToast(
    "تمت إضافة المنتج للسلة ✓"
  );

}



function removeFromCart(id) {

  cart =
    cart.filter(
      item => item.id !== id
    );


  saveCart();

  renderCart();

}



function saveCart() {

  localStorage.setItem(
    "shadowCart",
    JSON.stringify(cart)
  );

}



function renderCart() {

  const count =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.qty,
      0
    );


  cartCount.textContent =
    count;

  cartTotal.textContent =
    money(total);


  if (!cart.length) {

    cartItems.innerHTML = `
      <p class="empty">
        السلة فارغة حالياً.
      </p>
    `;

    return;

  }


  cartItems.innerHTML =
    cart.map(item => {

      return `
        <div class="cart-item">

          <span class="emoji">
            ${item.emoji}
          </span>


          <div>

            <h4>
              ${item.name}
            </h4>

            <small>
              ${money(item.price)}
              ×
              ${item.qty}
            </small>

          </div>


          <button
            class="remove"
            data-remove="${item.id}"
            aria-label="حذف"
          >
            ✕
          </button>

        </div>
      `;

    }).join("");


  document
    .querySelectorAll("[data-remove]")
    .forEach(button => {

      button.onclick = () => {

        removeFromCart(
          Number(
            button.dataset.remove
          )
        );

      };

    });

}



function openCart() {

  cartPanel.classList.add(
    "open"
  );

  overlay.classList.add(
    "show"
  );

}



function closeCart() {

  cartPanel.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );

}



function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 2200);

}



document
  .getElementById("cartButton")
  .onclick = openCart;


document
  .getElementById("closeCart")
  .onclick = closeCart;


overlay.onclick =
  closeCart;


search.oninput =
  renderProducts;



document
  .querySelectorAll(".category")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(
          ".category"
        )
        .forEach(item => {

          item.classList.remove(
            "active"
          );

        });


      button.classList.add(
        "active"
      );


      filter =
        button.dataset.filter;


      renderProducts();

    };

  });



document
  .getElementById("checkout")
  .onclick = () => {

    if (!cart.length) {

      showToast(
        "السلة فارغة"
      );

      return;

    }


    showToast(
      "الدفع التجريبي جاهز — اربط بوابة الدفع لإكمال الطلب"
    );

  };



renderProducts();

renderCart();
