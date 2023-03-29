document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#compose-form").onsubmit=compose;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  //showing the email
  fetch(`/emails/${mailbox}`).then(response=>response.json()).then(result=>{
    console.log(result);
    result.forEach(email=>{
      const element=document.createElement("div");
      //checking if email is read or not
      if(email.read){
        element.style.backgroundColor="Grey";
      }
      else{
        element.style.backgroundColor="black";
      }
      element.innerHTML=`Sender: ${email.sender} Subject: ${email.subject} timeStamp: ${email.timestamp} ` ;
      document.querySelector("#emails-view").append(element)
    });
  });
}

//function for submitting the mail
function compose(){
  let recipients=document.querySelector("#compose-recipients").value;
  let subject=document.querySelector("#compose-subject").value;
  let body=document.querySelector("#compose-body").value;
  fetch("/emails",{
    method:"POST",
    body:JSON.stringify({
      recipients:recipients,
      body:body,
      subject:subject,
    })
  }).then(response=>response.json()).then(result=>console.log(result));
  return false;
}