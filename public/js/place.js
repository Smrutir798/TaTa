document.getElementById('calculateCostBtn').addEventListener('click', function(event) {
    event.preventDefault();
    calculateCost();
});

document.querySelector('.place_order').addEventListener('submit', function(event) {
    event.preventDefault();
    submitOrder();
});

document.getElementById('generateOrderIdBtn').addEventListener('click', function() {
    const orderId = generateUniqueOrderId();
    document.getElementById('order_id').value = orderId;
});

function calculateCost() {
    const basePrices = {
        'item1': 10,
        'item2': 20
    };
    const weightRate = 2;
    const distanceRate = 1;
    const handlingFee = 5;
    const discountRate = 0.1;
    const taxRate = 0.05;

    const item = document.getElementById('item').value;
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const distance = parseFloat(document.getElementById('distance').value) || 0;

    if (!item || !quantity || !weight || !distance) {
        alert("Please fill out all fields correctly.");
        return;
    }

    let basePrice = basePrices[item] || 0;
    let cost = (basePrice * quantity) + (weight * weightRate) + (distance * distanceRate) + handlingFee;
    let discount = cost * discountRate;
    cost -= discount;
    let tax = cost * taxRate;
    cost += tax;

    document.getElementById('cost').textContent = `₹${cost.toFixed(2)}`;
}

function generateUniqueOrderId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 10;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    const timestamp = Date.now();
    return result + '_' + timestamp;
}

function submitOrder() {
    const orderId = document.getElementById('order_id').value;
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const item = document.getElementById('item').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const cost = document.getElementById('cost').textContent.replace('₹', ''); // Remove currency symbol

    if (!orderId || !name || !address || !phone || !email || !item || isNaN(quantity) || isNaN(weight) || isNaN(distance) || cost === '0.00') {
        alert("Please fill out all fields before placing an order.");
        return;
    }

    const orderData = {
        order_id: orderId,
        name,
        address,
        phone,
        email,
        item,
        quantity,
        weight,
        distance,
        cost: parseFloat(cost) // Ensure cost is a numeric value
    };

    fetch('http://localhost:1000/api/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order placed successfully');
        } else {
            alert('Error placing order: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error placing order');
    });
}
