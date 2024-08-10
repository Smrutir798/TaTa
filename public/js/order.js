document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:1000/api/orders')
        .then(response => response.json())
        .then(data => {
            const orderTableBody = document.querySelector('#orderTable tbody');
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.name}</td>
                    <td>${order.address}</td>
                    <td>${order.phone}</td>
                    <td>${order.email}</td>
                    <td>${order.item}</td>
                    <td>${order.quantity}</td>
                    <td>${order.weight}</td>
                    <td>${order.distance}</td>
                    <td>${order.cost}</td>
                    <td>${order.status}</td>
                `;
                orderTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching order data:', error));
});
