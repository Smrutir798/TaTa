document.getElementById('truckForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const truckData = {
      truckNumber: document.getElementById('truckNumber').value,
      truckType: document.getElementById('truckType').value,
      truckCapacity: document.getElementById('truckCapacity').value,
      truckModel: document.getElementById('truckModel').value,
      truckOwner: document.getElementById('truckOwner').value,
      truckOwnerContact: document.getElementById('truckOwnerContact').value,
      truckDriver: document.getElementById('truckDriver').value,
      truckDriverContact: document.getElementById('truckDriverContact').value,
      truckStatus: document.getElementById('truckStatus').value,
    };
  
    fetch('/api/register-truck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(truckData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Truck registered successfully');
      } else {
        alert('Error registering truck: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error registering truck');
    });
  });
  