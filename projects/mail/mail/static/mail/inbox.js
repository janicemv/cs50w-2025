document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';



}

function send_email(event) {

  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });

  load_mailbox('sent');

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.classList.add('row');
        emailDiv.classList.add('email-info');
        emailDiv.classList.add('pt-3');

        if (mailbox === 'sent') {
          emailDiv.innerHTML = `
            <div class="col-md-4">
            <p><strong>${email.recipients[0]}</strong></p>
            </div>
            <div class="col-md-4">
            <p>${email.subject}</p>
            </div>
            <div class="col-md-4">
            <p><small>${email.timestamp}</small></p>
            </div>
            `;
        } else {
          emailDiv.innerHTML = `
            <div class="col-md-4">
            <p><strong>${email.sender}</strong></p>
            </div>
            <div class="col-md-4">
            <p>${email.subject}</p>
            </div>
            <div class="col-md-4">
            <p><small>${email.timestamp}</small></p>
            </div>
            `;
        }

        if (email.read == false) {
          emailDiv.classList.add('unread');
        } else {
          emailDiv.classList.add('read');
        }

        emailDiv.addEventListener('click', function () {
          view_email(email.id);
        });
        document.querySelector('#emails-view').append(emailDiv);

      });
    });
}

function view_email(id) {

  document.querySelector('#view-email').innerHTML = '';

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email);

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#view-email').style.display = 'block';

      const viewMailDiv = document.createElement('div');
      viewMailDiv.classList.add('view-email');
      viewMailDiv.innerHTML = `
      <ul class="list-unstyled">
        <li><strong>From:</strong> ${email.sender}</li>
        <li><strong>To:</strong> ${email.recipients}</li>
        <li><strong>Subject:</strong> ${email.subject}</li>
        <li><strong>Sent on:</strong> ${email.timestamp}</li>
      <div id="actions">
        <button class="btn btn-sm my-2 btn-outline-info" id="reply">Reply</button>
      </div>

      <li>${email.body}</li>
      <ul>
      `;


      if (!email.read) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

      document.querySelector('#view-email').append(viewMailDiv);

      // Reply function

      replyButton = document.querySelector('#reply');

      replyButton.addEventListener('click', function () {
        compose_email();

        document.querySelector('#compose-recipients').value = email.recipients;

        let subject = email.subject;

        if(subject.startsWith("Re: ")){
          document.querySelector('#compose-subject').value = subject;          
        } else {
          document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        }
        
        document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: "${email.body}"`;


      });


      // Archive button (but not in sent emails)
      const loggedUser = document.body.dataset.username;

      if (email.sender !== loggedUser) {
        const archiveButton = document.createElement('button');
        archiveButton.id = "archive";

        archiveButton.innerHTML = email.archived ? "Unarchive" : "Archive";
        archiveButton.className = email.archived ? "btn btn-sm my-2 btn-outline-danger" : "btn btn-sm my-2 btn-outline-success";

        archiveButton.addEventListener('click', function () {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: !email.archived
            })
          })
            .then(() => { load_mailbox('inbox') });
        });
        document.querySelector('#actions').append(archiveButton);
      };

    });

}

