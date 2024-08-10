async function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      contact: document.getElementById('contact').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value
    };

    try {
      const response = await axios.post('http://localhost:3000/api/register', formData);
      alert(response.data);
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  }