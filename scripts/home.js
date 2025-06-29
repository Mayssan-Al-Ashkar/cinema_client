function updateWelcomeMessage() {
    const username = localStorage.getItem('username') || 'Guest';
    document.getElementById('username').textContent = username;
}

function updateDate() {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
}

function createMovieCard(movie) {
    const template = document.getElementById('movie-card-template');
    const card = template.content.cloneNode(true);

    const posterImg = card.querySelector('.movie-poster img');
    posterImg.src = movie.poster || "https://via.placeholder.com/300x450?text=No+Image";
    posterImg.alt = `${movie.title} Poster`;
    posterImg.onerror = () => {
        posterImg.src = "https://via.placeholder.com/300x450?text=No+Image";
    };

    card.querySelector('.movie-rating span').textContent = movie.rating ?? 'N/A';
    card.querySelector('.movie-title').textContent = movie.title;
    card.querySelector('.movie-cast').textContent = movie.cast ?? 'Unknown';


   card.querySelector('.trailer-btn').addEventListener('click', () => {
    window.location.href = `../pages/movie_details.html?id=${movie.id}`;
});

card.querySelector('.book-btn').addEventListener('click', () => {
    window.location.href = `../pages/book.html?id=${movie.id}`;
});
    return card;
}

function populateMovieSection(sectionId, movies) {
    const section = document.getElementById(sectionId);
    section.innerHTML = '';

    if (!movies.length) {
        section.innerHTML = '<p >No movies available.</p>';
        return;
    }

    movies.forEach(movie => {
        section.appendChild(createMovieCard(movie));
    });
}

function openTrailer(trailerUrl) {
    window.open(trailerUrl, '_blank');
}

function navigateToBooking(movieTitle) {
    window.location.href = `book.html?movie=${encodeURIComponent(movieTitle)}`;
}

function checkAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminLink = document.querySelector('.admin-only');
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'block' : 'none';
    }
}

function setupLogout() {
    const logoutBtn = document.querySelector('.logout a');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        window.location.href = '../index.html';
    });
}

async function fetchMovies() {
    try {
        const response = await axios.get('http://localhost/Cinema/cinema-server/controllers/get_movies.php');
        if (response.data.success) {
            return {
                nowShowing: response.data.nowShowing,
                comingSoon: response.data.comingSoon,
                suggested: response.data.suggested
            };
        } else {
            console.error('Failed to load movies:', response.data.message);
            return { nowShowing: [], comingSoon: [], suggested: [] };
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { nowShowing: [], comingSoon: [], suggested: [] };
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}
function bookNow(movieId) {
    localStorage.setItem('selected_movie_id', movieId);
    window.location.href = 'booking.html';
}

async function initializePage() {
    updateWelcomeMessage();
    updateDate();
    checkAdminStatus();
    setupLogout();
    setupMobileMenu();

    const movies = await fetchMovies();

    populateMovieSection('now-showing', movies.nowShowing);
}

document.addEventListener('DOMContentLoaded', initializePage);
