document.addEventListener("DOMContentLoaded", () => {
    const truckOwnerBtn = document.getElementById("truck-owner-btn");
    const userBtn = document.getElementById("user-btn");
    const loginForm = document.getElementById("login-form");

    truckOwnerBtn.addEventListener("click", () => {
        truckOwnerBtn.classList.add("selected");
        userBtn.classList.remove("selected");
        loginForm.classList.remove("hidden");
        loginForm.querySelector("button[type='submit']").textContent = "Login as Truck Owner";
    });

    userBtn.addEventListener("click", () => {
        userBtn.classList.add("selected");
        truckOwnerBtn.classList.remove("selected");
        loginForm.classList.remove("hidden");
        loginForm.querySelector("button[type='submit']").textContent = "Login as User";
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const role = truckOwnerBtn.classList.contains('selected') ? 'truck_owner' : 'user';
        
        if (role === 'truck_owner') {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
    
                const data = await response.json();
    
                if (data.success) {
                    // Redirect to dashboard or any other page
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('There was an error!', error);
            }
        }else{
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
    
                const data = await response.json();
    
                if (data.success) {
                    // Redirect to dashboard or any other page
                    window.location.href = 'user_dashboard.html';
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
    });
});
