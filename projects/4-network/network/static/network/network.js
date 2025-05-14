document.addEventListener('DOMContentLoaded', () => {

    // Follow/Unfollow Button
    const followBtn = document.getElementById('follow-btn');

    if (followBtn) {

        followIcon = document.getElementById('follow-icon');
        btnText = document.getElementById('btn-text');

        followBtn.addEventListener('click', () => {
            const userId = followBtn.getAttribute('data-userid');
            const isFollowing = followBtn.getAttribute('data-isfollowing') === 'true';

            fetch(`/follow/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')  // Certifique-se de que getCookie está definido
                },
                body: JSON.stringify({ action: isFollowing ? 'unfollow' : 'follow' }) // Boa prática: explicitar a ação
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erroe in requisition.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Test: Response received', data);

                    if (data.success) {
                        btnText.textContent = isFollowing ? 'Unfollow' : 'Follow';

                        followBtn.setAttribute('data-isfollowing', (!isFollowing).toString());

                        followIcon.classList.remove(isFollowing ? 'fa-eye' : 'fa-eye-slash');
                        followIcon.classList.add(isFollowing ? 'fa-eye-slash' : 'fa-eye');

                        followBtn.classList.remove(isFollowing ? 'btn-success' : 'btn-danger');
                        followBtn.classList.add(isFollowing ? 'btn-danger' : 'btn-success');

                        const followersCountEl = document.getElementById('followers');
                        if (followersCountEl && data.followersCount !== undefined) {
                            followersCountEl.textContent = data.followersCount;
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    // Edit Post

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postid;
            const editSection = document.getElementById(`edit-post-${postId}`);
            const postContent = document.getElementById(`post-content-${postId}`);

            if (editSection.classList.contains('d-none')) {
                editSection.classList.remove('d-none');
                postContent.classList.add('d-none');
            } else {
                editSection.classList.add('d-none');
                postContent.classList.remove('d-none');
            }
        });
    });

    const editForms = document.querySelectorAll('.edit-post-form');

    editForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const postId = form.dataset.postid;
            const textarea = form.querySelector('.edit-content');
            const newContent = textarea.value;

            fetch(`/edit/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ content: newContent })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error editing post.');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const postContent = document.getElementById(`post-content-${postId}`);
                        postContent.textContent = newContent;
                        console.log('Post edited successfully:', data);

                        document.getElementById(`edit-post-${postId}`).classList.add('d-none');
                        postContent.classList.remove('d-none');
                    }
                })
                .catch(error => {
                    console.error('Error editing:', error);
                });
        });
    });

    // Like/Unlike Post
    // PAREI AQUI

    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postid;
            const like = document.getElementById(`like-post-${postId}`);

           fetch(`/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') 
                },
                body: JSON.stringify({ action: isFollowing ? 'unfollow' : 'follow' })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erroe in requisition.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Test: Response received', data);

                    if (data.success) {
                        btnText.textContent = isFollowing ? 'Unfollow' : 'Follow';

                        followBtn.setAttribute('data-isfollowing', (!isFollowing).toString());

                        followIcon.classList.remove(isFollowing ? 'fa-eye' : 'fa-eye-slash');
                        followIcon.classList.add(isFollowing ? 'fa-eye-slash' : 'fa-eye');

                        followBtn.classList.remove(isFollowing ? 'btn-success' : 'btn-danger');
                        followBtn.classList.add(isFollowing ? 'btn-danger' : 'btn-success');

                        const followersCountEl = document.getElementById('followers');
                        if (followersCountEl && data.followersCount !== undefined) {
                            followersCountEl.textContent = data.followersCount;
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
        });
        });
    });
    
});


// Get CSRF token
// From https://docs.djangoproject.com/en/4.2/ref/csrf/#ajax

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
