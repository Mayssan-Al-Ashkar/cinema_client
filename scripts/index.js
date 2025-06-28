document.addEventListener('DOMContentLoaded', () => {
    const menuic = document.querySelector('.menuic');
    const navLinks = document.querySelector('.nav-links');

    menuic?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuic.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('active');
                menuic.classList.remove('active');
            }
        });
    });

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(new FormData(loginForm).entries());


    try {
        const response = await axios.post(
            "http://localhost/Cinema/cinema-server/controllers/login.php",
            payload
        );

        const data = response.data;

        alert(data.message);

        if (data.success) {
            localStorage.setItem("username", data.username);
            localStorage.setItem("user_id", data.user_id);

            window.location.href = "pages/home.html";
        }
    } catch (error) {
        console.error(error);
        alert("Login failed.");
    }
});



   registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const payload = Object.fromEntries(formData.entries());

    if (payload.password !== payload.confirm_password) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost/Cinema/cinema-server/controllers/register.php",
            payload
        );

        const data = response.data;
        alert(data.message); 
    } catch (error) {
        console.error(error);
        alert("Registration failed.");
    }
});


});

function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (formType === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
}
