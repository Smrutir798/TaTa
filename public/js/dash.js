document.querySelector('.inserting').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    const order_id = document.getElementById('order_id').value;
    const status = document.getElementById('status').value;

    const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id, status })
    });

    const result = await response.json();
    if (result.success) {
        alert('Order status updated successfully');
    } else {
        alert('Error updating order status: ' + result.message);
    }
});