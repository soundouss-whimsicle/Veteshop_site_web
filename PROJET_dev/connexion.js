const connexion=document.getElementById("connexion");
const username=document.getElementById("username");
const password=document.getElementById("password");
 const erreur = document.getElementById("erreur");
 connexion.addEventListener("submit",(event) =>{
   event.preventDefault();
    const ValeurNom=username.value.trim();
   const  ValeurPassw=password.value.trim();
   if(ValeurNom===""||ValeurPassw.length<=8){
    erreur.textContent= "vérifiez votre username ou password";
    erreur.style.color="red";
    erreur.textContent="";
    return;
   }

 });
