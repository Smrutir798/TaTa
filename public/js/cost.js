document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateCost();
});

function calculateCost() {
    const basePrices = {
        'item1': 10,
        'item2': 20
    };
    const weightRate = 2; // Cost per unit weight
    const distanceRate = 1; // Cost per unit distance
    const handlingFee = 5;
    const discountRate = 0.1;
    const taxRate = 0.05;

    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const weight = parseInt(document.getElementById('weight').value);
    const distance = parseInt(document.getElementById('distance').value);

    let basePrice = basePrices[item] || 0;
    let cost = (basePrice * quantity) + (weight * weightRate) + (distance * distanceRate) + handlingFee;
    let discount = cost * discountRate;
    cost -= discount;
    let tax = cost * taxRate;
    cost += tax;

    document.getElementById('cost').textContent = `₹${cost.toFixed(2)}`;
}
