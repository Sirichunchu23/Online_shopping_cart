// Sample product data with images
const products = [
    { id: 1, name: "Laptop", price: 999, image: "https://wallpapers.com/images/featured/laptop-pictures-2l1fs0hwq4c9obgx.jpg" },
    { id: 2, name: "Smartphone", price: 499, image: "https://tse2.mm.bing.net/th/id/OIP.jReE2FbQZR3gx8WIeeZBKgHaHy?pid=Api&P=0&h=180" },
    { id: 3, name: "Headphones", price: 79, image: "https://tse4.mm.bing.net/th/id/OIP.-IdQe8AUleQiwwnaYazM-wHaHa?pid=Api&P=0&h=180" },
    { id: 4, name: "Smart Watch", price: 199, image: "https://tse4.mm.bing.net/th/id/OIP.tO9kh8kWiYJ8vKlF_ZJlbQHaIg?pid=Api&P=0&h=180" },
    { id: 5, name: "Tablet", price: 299, image: "https://sp.yimg.com/ib/th?id=OPAC.YBiAkROqJg5GTw474C474&o=5&pid=21.1&w=160&h=105" },
    { id: 6, name: "Bluetooth Speaker", price: 49, image: "https://tse2.mm.bing.net/th/id/OIP.aRQGZCgCghDYp_nwSvV4MwAAAA?pid=Api&P=0&h=180" },
    { id: 7, name: "Gaming Console", price: 399, image: "https://tse1.mm.bing.net/th/id/OIP.vkGXvbS-fHNYpfLHi5k6-QHaEf?pid=Api&P=0&h=180" },
    { id: 8, name: "Camera", price: 549, image: "https://sp.yimg.com/ib/th?id=OPAC.ep5%2bJ%2blx0r6ctA474C474&o=5&pid=21.1&w=160&h=105" },
    { id: 9, name: "Wireless Mouse", price: 25, image: "https://tse4.mm.bing.net/th/id/OIP.X-InXN9-qDE6D5DnxMwKowHaHx?pid=Api&P=0&h=180" },
    { id: 10, name: "External Hard Drive", price: 89, image: "https://tse3.mm.bing.net/th/id/OIP.CpIW8FPbjRdTawikfug3wAHaFe?pid=Api&P=0&h=180" },
    
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalAmount = document.getElementById("totalAmount");
const cartCount = document.getElementById("cartCount");
const checkoutPage = document.getElementById("checkoutPage");
const cartPage = document.getElementById("cartPage");
const orderHistoryPage = document.getElementById("orderHistoryPage");
const orderList = document.getElementById("orderList");
const searchInput = document.getElementById("searchInput");

// Display products
function displayProducts(items) {
    productList.innerHTML = "";
    items.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(div);
    });
}

// Add product to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Update cart display and storage
function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Show cart page
function goToCart() {
    productList.classList.add("hidden");
    checkoutPage.classList.add("hidden");
    orderHistoryPage.classList.add("hidden");
    cartPage.classList.remove("hidden");
    renderCart();
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(div);
    });
    totalAmount.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    renderCart();
}

// Show checkout form
function checkout() {
    cartPage.classList.add("hidden");
    checkoutPage.classList.remove("hidden");
}

// Handle order submission
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    const order = {
        id: new Date().getTime(),
        name,
        address,
        email,
        items: cart,
        date: new Date().toLocaleString(),
    };
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    cart = [];
    updateCart();
    alert("Order placed successfully!");
    showOrderHistory();
});

// Show order history
function showOrderHistory() {
    checkoutPage.classList.add("hidden");
    productList.classList.add("hidden");
    cartPage.classList.add("hidden");
    orderHistoryPage.classList.remove("hidden");

    orderList.innerHTML = "";
    orders.forEach(order => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h4>Order ID: ${order.id}</h4>
            <p>Name: ${order.name}</p>
            <p>Address: ${order.address}</p>
            <p>Email: ${order.email}</p>
            <p>Date: ${order.date}</p>
            <p>Items:</p>
            <ul>${order.items.map(i => `<li>${i.name} x ${i.quantity} ($${i.price})</li>`).join("")}</ul>
        `;
        orderList.appendChild(div);
    });
}

// Search functionality
searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
});

// Initial render
displayProducts(products);
updateCart();
