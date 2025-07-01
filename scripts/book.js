const layout = document.getElementById('seat-layout');
const totalPriceEl = document.getElementById('total-price');
const confirmBtn = document.getElementById('submit-booking');

const userId = parseInt(localStorage.getItem('user_id'));
const movieId = parseInt(new URLSearchParams(window.location.search).get("id"));

let selectedSeats = [];

const normalPrice = 500;
const premiumPrice = 800;
const premiumRows = ['A', 'B', 'C'];

function updatePrice() {
  let total = 0;
  selectedSeats.forEach(seat => {
    total += seat.type === 'premium' ? premiumPrice : normalPrice;
  });
  totalPriceEl.innerText = `Total: ${total} LBP`;
}

function renderSeats(reserved = []) {
  layout.innerHTML = '';
  const rows = ['A','B','C','D','E','F','G','H'];
  const cols = 12;
  rows.forEach(row => {
    for (let i = 1; i <= cols; i++) {
      const id = row + i;
      const seat = document.createElement('div');
      seat.classList.add('seat');
      seat.dataset.id = id;
      seat.dataset.type = premiumRows.includes(row) ? 'premium' : 'normal';
      seat.classList.add(premiumRows.includes(row) ? 'premium' : 'normal');

      if (reserved.includes(id)) {
        seat.classList.add('reserved');
      } else {
        seat.addEventListener('click', () => toggleSeat(seat));
      }
      layout.appendChild(seat);
    }
  });
}

function toggleSeat(seatDiv) {
  const id = seatDiv.dataset.id;
  const type = seatDiv.dataset.type;

  const index = selectedSeats.findIndex(s => s.id === id);
  if (index !== -1) {
    selectedSeats.splice(index, 1);
    seatDiv.classList.remove('selected');
  } else {
    selectedSeats.push({ id, type });
    seatDiv.classList.add('selected');
  }
  updatePrice();
}

async function loadReservedSeats() {
  try {
    const res = await axios.get(`http://localhost/Cinema/cinema-server/controllers/get_reserved_seats.php?movie_id=${movieId}`);
    renderSeats(res.data.reserved_seats);
  } catch (err) {
    alert('Failed to load seats');
  }
}

confirmBtn.addEventListener('click', async () => {
  if (!userId || !selectedSeats.length) return alert("Login & select seats.");
  try {
    const res = await axios.post("http://localhost/Cinema/cinema-server/controllers/confirm_booking.php", {
      user_id: userId,
      movie_id: movieId,
      seats: selectedSeats
    });
    if (res.data.success) {
      alert('error');
      loadReservedSeats();
    } else {
      alert('Error');
    }
  } catch (err) {
    alert("Error");
  }
});

window.onload = loadReservedSeats;
