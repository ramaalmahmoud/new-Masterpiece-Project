async function register(params) {
    debugger
    
    const url="https://localhost:7084/api/User/createAccount";
    var form=document.getElementById("form");
    event.preventDefault();
   
   
    var formData=new FormData(form);
    let repeatPass=document.getElementById("repeatPass").value;
    let password=document.getElementById("password").value
    if(repeatPass!=password){
        window.alert("The passwords you entered do not match. Please ensure both passwords are identical.");
        return;
    }
    let response=await fetch(url,{
        method:'POST',
        body:formData,
    })
    if(!response.ok){
window.alert("The email you entered is already in use. Please try a different one.");
    }
    let data=await response.json();
   
   
    window.location.href = "login.html";
   
    window.alert("You have successfully registered! Welcome aboard.");

}




async function login() {
    debugger
    const url ="https://localhost:7084/api/User/login";
    var form=document.getElementById("forml");
    event.preventDefault();
   
   
    var formData=new FormData(form);
    let response=await fetch(url,{
        method:'POST',
        body:formData,
    })
    var result= await response.json();

  let token= localStorage.jwtToken=result.token;
  localStorage.UserID=result.userId;
   console.log("token",token)

if(response.ok){
    window.alert("User logged in successfully ");
    window.location.href ='index.html';
    

}
else{
    window.alert("email or password wrong"); 
}
    


   
    
}