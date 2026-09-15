/* =========================================================
   SHADOWSHOP SCRIPT
   ========================================================= */


/* =========================================================
   DISCORD
   ========================================================= */

const DISCORD_TICKET_URL =
  "https://discord.com/channels/478919772713517096/1549279759186403419";


/* =========================================================
   PRODUCTS
   ========================================================= */

const products = [

  {
    id: "tz",
    name: "TZ",
    image: "tz.png",
    prices: {
      week: 10,
      month: 20,
      year: 30,
      lifetime: 30
    }
  },

  {
    id: "tzx",
    name: "TZX",
    image: "tzx.png",
    prices: {
      week: 5,
      month: 20,
      year: 35,
      lifetime: 35
    }
  },

  {
    id: "vanity",
    name: "Vanity",
    image: "vanity.png",
    prices: {
      week: 10,
      month: 20,
      year: 50,
      lifetime: 50
    }
  },

  {
    id: "macho",
    name: "macho",
    image: "macho.png",
    prices: {
      week: 10,
      month: 12,
      year: 35,
      lifetime: 50
    }
  },

  {
    id: "redengine",
    name: "Read Engine",
    image: "readendgine.png",
    prices: {
      week: 6,
      month: 18,
      year: 45,
      lifetime: 50
    }
  },

  {
    id: "susano",
    name: "Susano",
    image: "susano.png",
    prices: {
      week: 8,
      month: 25,
      year: 60,
      lifetime: 50
    }
  },

  {
    id: "lumia",
    name: "lumia",
    image: "lumia.png",
    prices: {
      week: 5,
      month: 18,
      year: 45,
      lifetime: 50
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
   ORDER ID
   ========================================================= */

function generateOrderId() {

  const number =
    Math.floor(
      10000 + Math.random() * 90000
    );

  return "SS-" + number;
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


  if ($("cartCount")) {

    $("cartCount").textContent =
      count;

  }


  if ($("mobileCartCount")) {

    $("mobileCartCount").textContent =
      count;

  }


  if (cart.length === 0) {

    itemsElement.innerHTML = "";

    emptyElement.style.display =
      "block";

    if ($("cartTotal")) {

      $("cartTotal").textContent =
        "$0.00";

    }

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
                type="button"
                data-minus="${index}">
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                type="button"
                data-plus="${index}">
                +
              </button>

            </div>

            <button
              type="button"
              class="remove-item"
              data-remove="${index}"
              aria-label="Remove item">
              ×
            </button>

          </div>

        `;

      }
    ).join("");


  if ($("cartTotal")) {

    $("cartTotal").textContent =
      money(total);

  }


  /* ================= MINUS ================= */

  itemsElement
    .querySelectorAll("[data-minus]")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(
            button.dataset.minus
          );


        if (!cart[index])
          return;


        cart[index].qty--;


        if (
          cart[index].qty <= 0
        ) {

          cart.splice(index, 1);

        }


        saveCart();

      };

    });


  /* ================= PLUS ================= */

  itemsElement
    .querySelectorAll("[data-plus]")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(
            button.dataset.plus
          );


        if (!cart[index])
          return;


        cart[index].qty++;

        saveCart();

      };

    });


  /* ================= REMOVE ================= */

  itemsElement
    .querySelectorAll("[data-remove]")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(
            button.dataset.remove
          );


        if (!cart[index])
          return;


        const productName =
          cart[index].name;


        cart.splice(index, 1);

        saveCart();


        toast(
          productName +
          " removed from cart"
        );

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


        if (!product)
          return;


        const select =
          grid.querySelector(
            `[data-duration="${product.id}"]`
          );


        if (!select)
          return;


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

  if ($("cartPanel")) {

    $("cartPanel")
      .classList.add("open");

  }


  if ($("overlay")) {

    $("overlay")
      .classList.add("show");

  }

}


function closeCart() {

  if ($("cartPanel")) {

    $("cartPanel")
      .classList.remove("open");

  }


  if ($("overlay")) {

    $("overlay")
      .classList.remove("show");

  }

}


/* =========================================================
   FIVEM CATEGORY
   ========================================================= */

if ($("fivemCategory")) {

  $("fivemCategory").onclick =
    () => {

      $("fivemStore")
        ?.classList.add("visible");


      $("fivemStore")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    };

}


if ($("backToProducts")) {

  $("backToProducts").onclick =
    () => {

      $("fivemStore")
        ?.classList.remove("visible");


      $("categories")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    };

}


/* =========================================================
   EXPLORE BUTTON
   ========================================================= */

if ($("exploreProducts")) {

  $("exploreProducts").onclick =
    () => {

      $("fivemStore")
        ?.classList.add("visible");


      $("fivemStore")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    };

}


/* =========================================================
   MOBILE HOME
   ========================================================= */

if ($("mobileHomeButton")) {

  $("mobileHomeButton").onclick =
    () => {

      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    };

}


if ($("mobileMenuButton")) {

  $("mobileMenuButton").onclick =
    () => {

      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    };

}


/* =========================================================
   CART BUTTONS
   ========================================================= */

if ($("cartButton")) {

  $("cartButton").onclick =
    openCart;

}


if ($("mobileCartButton")) {

  $("mobileCartButton").onclick =
    openCart;

}


if ($("closeCart")) {

  $("closeCart").onclick =
    closeCart;

}


if ($("overlay")) {

  $("overlay").onclick =
    closeCart;

}


/* =========================================================
   ACCOUNT
   ========================================================= */

/*
   Login / Supabase removed.

   If the old Account button still exists
   in index.html, clicking it will simply
   show a message instead of opening Login.
*/

if ($("accountButton")) {

  $("accountButton").onclick =
    () => {

      toast(
        "Account system is currently unavailable."
      );

    };

}


if ($("mobileAccountButton")) {

  $("mobileAccountButton").onclick =
    () => {

      toast(
        "Account system is currently unavailable."
      );

    };

}


/* =========================================================
   CHECKOUT → DISCORD TICKET
   ========================================================= */

if ($("checkoutButton")) {

  $("checkoutButton").onclick =
    async () => {

      /* ================= EMPTY CART ================= */

      if (cart.length === 0) {

        toast(
          "Your cart is empty."
        );

        return;

      }


      /* ================= ORDER ID ================= */

      const orderId =
        generateOrderId();


      /* ================= TOTAL ================= */

      let total = 0;


      /* ================= ORDER LINES ================= */

      const orderLines =
        cart.map(
          item => {

            const itemTotal =
              item.price * item.qty;


            total += itemTotal;


            return (
              "• " +
              item.name +
              " — " +
              item.duration +
              " — Qty: " +
              item.qty +
              " — " +
              money(itemTotal)
            );

          }
        );


      /* ================= ORDER MESSAGE ================= */

      const orderMessage =
`🛒 SHADOW SHOP - PURCHASE

🆔 Order ID: ${orderId}

${orderLines.join("\n")}

💰 Total: ${money(total)}

🎫 Please select "Purchases" in the ticket panel.

Thank you for choosing Shadow Shop!`;


      /* ================= SAVE ORDER ================= */

      localStorage.setItem(

        "shadow_last_order",

        JSON.stringify({

          orderId,

          items: cart,

          total,

          message: orderMessage,

          createdAt:
            new Date().toISOString()

        })

      );


      /* ================= COPY ORDER ================= */

      let copied = false;


      try {

        await navigator.clipboard.writeText(
          orderMessage
        );

        copied = true;

      } catch (error) {

        console.error(
          "COPY ERROR:",
          error
        );

      }


      /* ================= MESSAGE ================= */

      if (copied) {

        toast(
          "Order copied! Opening Discord..."
        );

      } else {

        toast(
          "Opening Discord..."
        );

      }


      /* ================= OPEN DISCORD ================= */

      setTimeout(
        () => {

          window.open(
            DISCORD_TICKET_URL,
            "_blank",
            "noopener,noreferrer"
          );

        },
        700
      );

    };

}


/* =========================================================
   START
   ========================================================= */

renderProducts();

renderCart();