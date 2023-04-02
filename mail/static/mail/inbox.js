document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //Used to compose an email
  document.querySelector("#compose-form").onsubmit=compose;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector("#email-content").style.display='none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-content").style.display='none';

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
      //entering the html
      element.innerHTML=`Sender: ${email.sender} Subject: ${email.subject} timeStamp: ${email.timestamp} ` ;
      document.querySelector("#emails-view").append(element);
      element.addEventListener("click",()=>{
        console.log(email);
        email_content(email.id);
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
        
        
    }
      )
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

function email_content(x){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-content").style.display='block';
   fetch(`emails/${x}`).then(response=>response.json()).then(data=>{
    console.log(data);
    let sender=data.sender;
    let recipient=data.recipients;
    let subject=data.subject;
    let timeStamp=data.timestamp;
    let body=data.body;
    document.querySelector("#email-content").innerHTML=`<h1>From: ${sender} to ${recipient}</h1><br><h2>Subject :${subject} Timestamp : ${timeStamp}</h2><br>${body}`
   })
 
}