async function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchMovieDetails(id) {
  try {
    const response = await axios.get(`http://localhost/Cinema/cinema-server/controllers/get_movie_details.php?id=${id}`);
    if (response.data.success) {
      displayMovieDetails(response.data.movie);
    } else {
      alert('Movie not found.');
    }
  } catch (error) {
    console.error('Error loading movie:', error);
  }
}

function displayMovieDetails(movie) {
  document.getElementById('cast-photo').src = movie.cast_photo;
  document.getElementById('movie-title').textContent = movie.title;
  document.getElementById('movie-description').textContent = movie.description;
  document.getElementById('movie-genre').textContent = movie.genre;
  document.getElementById('movie-rating').textContent = movie.rating;
  document.getElementById('movie-date').textContent = movie.release_date;
  document.getElementById('movie-cast').textContent = movie.cast;
}

document.getElementById('back-button').addEventListener('click', () => {
  window.location.href = 'home.html';
});

document.addEventListener('DOMContentLoaded', async () => {
  const id = await getMovieIdFromURL();
  if (id) {
    fetchMovieDetails(id);
  } else {
    alert('No movie ID provided.');
  }
});
