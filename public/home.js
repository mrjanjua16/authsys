document.addEventListener('DOMContentLoaded', function () {
    const updateUserForm = document.getElementById('updateUserForm');
    const deleteUserForm = document.getElementById('deleteUserForm');
    const messageContainer = document.getElementById('message-container');

    if (updateUserForm) {
        updateUserForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const formData = new FormData(updateUserForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch(updateUserForm.action, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                showMessage(result.message, response.ok);
            } catch (error) {
                console.error('Error updating user:', error);
                showMessage('An error occurred while updating the password.', false);
            }
        });
    }

    if (deleteUserForm) {
        deleteUserForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const confirmDelete = confirm('Are you sure you want to delete your account?');
            if (!confirmDelete) return;

            try {
                const response = await fetch(deleteUserForm.action, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    }
                });

                const result = await response.json();
                showMessage(result.message, response.ok);

                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                showMessage('An error occurred while deleting the account.', false);
            }
        });
    }

    function showMessage(message, success) {
        messageContainer.textContent = message;
        messageContainer.style.color = success ? 'green' : 'red';
        messageContainer.style.display = 'block';
    }
});
