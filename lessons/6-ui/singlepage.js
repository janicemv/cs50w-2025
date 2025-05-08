function showPage(page) {

    document.querySelectorAll('div').forEach(div => {
        div.style.display = 'none';
    });

    document.querySelector(`#${page}`).style.display = 'block';
}

// Wait for page to loaded:
document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('button').forEach(button => {

        button.onclick = function() {
            showPage(this.dataset.page);
        }
    })
});