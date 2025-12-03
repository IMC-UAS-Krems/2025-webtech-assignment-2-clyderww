const products = [
  { id: 1, name: "Winter Warmth Kit", price: 25.0 },
  { id: 2, name: "School Starter Kit", price: 18.0 },
  { id: 3, name: "Emergency Food Box", price: 30.0 },
  { id: 4, name: "Hygiene Kit", price: 12.0 },
  { id: 5, name: "Baby Care Pack", price: 28.0 },
  { id: 6, name: "Clean Water Pack", price: 20.0 },
  { id: 7, name: "Health Check", price: 22.0 },
  { id: 8, name: "Online Learning Pack", price: 15.0 },
  { id: 9, name: "Toy Pack", price: 10.0 },
  { id: 10, name: "Hot Meal", price: 8.0 },
];

let cart = [];

function findProduct(id) {
  return products.find((p) => p.id === id);
}

function addToCart(id) {
  const item = cart.find((entry) => entry.productId === id);
  if (item) {
    item.qty = item.qty + 1;
  } else {
    cart.push({ productId: id, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const tbody = document.querySelector("#cart-table tbody");
  const subtotalSpan = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("checkout-btn");

  tbody.innerHTML = "";

  if (cart.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="text-center text-muted">Cart is empty</td>`;
    tbody.appendChild(row);
    subtotalSpan.textContent = "0.00";
    checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  let totalQty = 0;

  cart.forEach((entry) => {
    const product = findProduct(entry.productId);
    const lineTotal = product.price * entry.qty;
    subtotal += lineTotal;
    totalQty += entry.qty;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td class="text-center">${entry.qty}</td>
      <td class="text-end">${lineTotal.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });

  subtotalSpan.textContent = subtotal.toFixed(2);
  checkoutBtn.disabled = false;
}

function setStep(step) {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  const progressBar = document.getElementById("progress-bar");

  if (step === 1) {
    step1.classList.remove("d-none");
    step2.classList.add("d-none");
    step3.classList.add("d-none");
    progressBar.style.width = "33%";
    progressBar.textContent = "Step 1 of 3";
  } else if (step === 2) {
    step1.classList.add("d-none");
    step2.classList.remove("d-none");
    step3.classList.add("d-none");
    progressBar.style.width = "66%";
    progressBar.textContent = "Step 2 of 3";
  } else if (step === 3) {
    step1.classList.add("d-none");
    step2.classList.add("d-none");
    step3.classList.remove("d-none");
    progressBar.style.width = "100%";
    progressBar.textContent = "Step 3 of 3";
  }
}

function validateForm() {
  let isValid = true;

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const country = document.getElementById("country");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const zip = document.getElementById("zip");

  [fullName, email, phone, country, address, city, zip].forEach((input) => {
    input.classList.remove("is-invalid");
  });

  if (fullName.value.trim() === "") {
    fullName.classList.add("is-invalid");
    isValid = false;
  }

  if (!email.value.includes("@") || email.value.trim() === "") {
    email.classList.add("is-invalid");
    isValid = false;
  }

  const phoneValue = phone.value.trim();
  const phoneRegex = /^[0-9]{6,15}$/;
  if (!phoneRegex.test(phoneValue)) {
    phone.classList.add("is-invalid");
    isValid = false;
  }

  if (country.value.trim() === "") {
    country.classList.add("is-invalid");
    isValid = false;
  }

  if (address.value.trim() === "") {
    address.classList.add("is-invalid");
    isValid = false;
  }

  if (city.value.trim() === "") {
    city.classList.add("is-invalid");
    isValid = false;
  }

  const zipValue = zip.value.trim();
  const zipRegex = /^[A-Za-z0-9]{1,6}$/;
  if (!zipRegex.test(zipValue)) {
    zip.classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}

function calculateTotals() {
  let subtotal = 0;
  let totalQty = 0;

  cart.forEach((entry) => {
    const product = findProduct(entry.productId);
    subtotal += product.price * entry.qty;
    totalQty += entry.qty;
  });

  let discount = 0;
  if (totalQty >= 3) {
    discount = subtotal * 0.1;
  }

  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.05;
  const total = afterDiscount + tax;

  return {
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total,
  };
}

function showConfirmation() {
  const tbody = document.querySelector("#summary-table tbody");
  tbody.innerHTML = "";

  cart.forEach((entry) => {
    const product = findProduct(entry.productId);
    const lineTotal = product.price * entry.qty;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td class="text-center">${entry.qty}</td>
      <td class="text-end">${product.price.toFixed(2)}</td>
      <td class="text-end">${lineTotal.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });

  const totals = calculateTotals();
  document.getElementById("summary-subtotal").textContent =
    totals.subtotal.toFixed(2);
  document.getElementById("summary-discount").textContent =
    totals.discount.toFixed(2);
  document.getElementById("summary-tax").textContent = totals.tax.toFixed(2);
  document.getElementById("summary-total").textContent =
    totals.total.toFixed(2);

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const zip = document.getElementById("zip").value;
  const notes = document.getElementById("notes").value.trim();

  document.getElementById("summary-name").textContent = fullName;
  document.getElementById("summary-email").textContent = email;
  document.getElementById("summary-phone").textContent = phone;
  document.getElementById("summary-address").textContent =
    address + ", " + zip + " " + city + ", " + country;
  document.getElementById("summary-notes").textContent =
    notes === "" ? "No special notes." : notes;
}

function resetAll() {
  cart = [];
  updateCartUI();
  const form = document.getElementById("checkout-form");
  form.reset();
  form.querySelectorAll(".form-control").forEach((input) => {
    input.classList.remove("is-invalid");
  });
  setStep(1);
}

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.productId, 10);
      addToCart(id);
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.addEventListener("click", function () {
    setStep(2);
    window.scrollTo(0, 0);
  });

  const backBtn = document.getElementById("back-to-cart-btn");
  backBtn.addEventListener("click", function () {
    setStep(1);
    window.scrollTo(0, 0);
  });

  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    showConfirmation();
    setStep(3);
    window.scrollTo(0, 0);
  });

  const startOverBtn = document.getElementById("start-over-btn");
  startOverBtn.addEventListener("click", function () {
    resetAll();
    window.scrollTo(0, 0);
  });

  updateCartUI();
  setStep(1);
});
