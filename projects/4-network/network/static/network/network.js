document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.getElementById('follow-btn');
    followBtn.addEventListener('click', () => {
        const userId = followBtn.getAttribute('data-userid');
        const isFollowing = followBtn.getAttribute('data-isfollowing') === 'True';
        const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        fetch(`/follow/${userId}`, {
            method: 'POST',
           headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Test: Response received', data);
                if (data.success) {
                    followBtn.textContent = isFollowing ? 'Follow' : 'Unfollow';
                    followBtn.setAttribute('data-isFollowing', !isFollowing);
                    document.getElementById('followers').textContent = data.followersCount;
                } 
            })
            .catch(error => console.error('Error:', error));
    });
});

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
