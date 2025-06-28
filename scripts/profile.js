document.addEventListener('DOMContentLoaded', () => {
const user_id = parseInt(localStorage.getItem('user_id'));

    if (!user_id) {
        alert("You're not logged in.");
        return;
    }

    const form = document.getElementById('profile-form');

    axios.get(`http://localhost/Cinema/cinema-server/controllers/add_user_preferences.php?user_id=${user_id}`)
        .then(response => {
            if (response.data.success && response.data.data) {
                const data = response.data.data;
                document.getElementById('full_name').value = data.full_name || '';
                document.getElementById('age').value = data.age || '';
                document.getElementById('gender').value = data.gender || '';
                document.getElementById('location').value = data.location || '';
                document.getElementById('favorite_genre').value = data.favorite_genre || '';
                document.getElementById('payment_method').value = data.payment_method || '';
                document.getElementById('communication_pref').value = data.communication_pref || '';
            }
        });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            user_id: parseInt(user_id),
            full_name: document.getElementById('full_name').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            location: document.getElementById('location').value,
            favorite_genre: document.getElementById('favorite_genre').value,
            payment_method: document.getElementById('payment_method').value,
            communication_pref: document.getElementById('communication_pref').value

        };

        try {
            const response = await axios.post('http://localhost/Cinema/cinema-server/controllers/add_user_preferences.php', payload);
            if (response.data.success) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            alert('Server error: ' + err.message);
        }
    });
});
