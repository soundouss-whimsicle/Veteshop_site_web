const erreurCouleur = document.querySelector("#erreurCouleur");
const erreurTaille = document.querySelector("#erreurTaille");
const quantite=document.querySelector("#quantite");
const form=document.querySelector("#form");
const plus = document.querySelector("#plus");
const moins = document.querySelector("#moins");
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    erreurCouleur.textContent = "";
    erreurTaille.textContent = "";
 const quantite=document.querySelector("#quantite")
 const couleur=document.querySelector('input[name="couleur"]:checked');
const taille=document.querySelector('input[name="taille"]:checked');
    if(couleur===null){
        erreurCouleur.textContent="vous devez choisir un coulour ";
        erreurCouleur.style.color="red";
    }
     if(taille===null){
        erreurTaille.textContent="vous devez choisir une taille ";
        erreurTaille.style.color="red";
    }

    })
    plus.addEventListener("click",(event)=>{
        quantite.value=Number(quantite.value)+1;
    })
     moins.addEventListener("click",(event)=>{
        if(quantite.value>1){
        quantite.value=Number(quantite.value)-1;}
    })


