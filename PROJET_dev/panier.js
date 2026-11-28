// SÃ©lectionner les Ã©lÃ©ments HTML
const panierVide = document.querySelector("#panierVide");
const tablePanier = document.querySelector("#tablePanier");
const listeProduits = document.querySelector("#listeProduits");
const prixTotal = document.querySelector("#prixTotal");
const totalProduits = document.querySelector("#totalProduits");
const fraisLivraison = document.querySelector("#fraisLivraison");

// RÃ©cupÃ©rer l'Ã©lÃ©ment du compteur
const compteurPanier = document.querySelector("#badgePanier");
// CrÃ©er la fonction du compteur
function afficherCompteur() {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
     let nombreArticles = 0;
    for (let i = 0; i < panier.length; i++) {
        nombreArticles += Number(panier[i].quantite) || 0;
    }
    if (compteurPanier) compteurPanier.textContent = nombreArticles;

}
// Appeler la fonction
afficherCompteur();

// RÃ©cupÃ©rer le panier
let panier = JSON.parse(localStorage.getItem("panier")) || [];

// Initialiser les totaux
let total = 0;
let totalFinal = 0;

// VÃ©rifier si le panier est vide
if (panier.length === 0) {
    tablePanier.hidden = true;
    panierVide.hidden = false;
} else {
    tablePanier.hidden = false;
    panierVide.hidden = true;
}

// CrÃ©er les lignes du panier
for (let i = 0; i < panier.length; i++) {

    
// CrÃ©er une ligne et ses cellules
const ligne = document.createElement("tr");

const celluleNom = document.createElement("td");
const cellulePrix = document.createElement("td");
const celluleQuantite = document.createElement("td");
const celluleSousTotal = document.createElement("td");
const celluleAction = document.createElement("td");

const boutonSupprimer = document.createElement("button");

// CrÃ©er les boutons de quantitÃ©
const selectQuantite = document.createElement("select");
selectQuantite.setAttribute("aria-label", `Quantité de ${panier[i].nom}`);
for (let quantite = 1; quantite <= 10; quantite++) {
    const option = document.createElement("option");
    option.value = quantite;
    option.textContent = quantite;
    option.selected = quantite === Number(panier[i].quantite);
    selectQuantite.appendChild(option);
}
celluleQuantite.appendChild(selectQuantite);
// Remplir les autres cellules
celluleNom.textContent = panier[i].nom;
cellulePrix.textContent = panier[i].prix + " DH";

// Calculer le sous-total
let sousTotalCourant = Number(panier[i].prix) * Number(panier[i].quantite);
const sousTotal = sousTotalCourant;
celluleSousTotal.textContent = sousTotal + " DH";

// Additionner les sous-totaux
total += sousTotal;

selectQuantite.addEventListener("change", () => {
    panier[i].quantite = Number(selectQuantite.value);
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherCompteur();
    const nouveauSousTotal = Number(panier[i].prix) * panier[i].quantite;
    celluleSousTotal.textContent = nouveauSousTotal + " DH";
    total += nouveauSousTotal - sousTotalCourant;
    sousTotalCourant = nouveauSousTotal;
    livraison = total >= 500 ? 0 : 35;
    totalProduits.textContent = total + " DH";
    fraisLivraison.textContent = livraison + " DH";
    prixTotal.textContent = (total + livraison) + " DH";
});
// Ajouter l'icÃ´ne supprimer
boutonSupprimer.innerHTML = '<i class="fa-solid fa-trash"></i>';
celluleAction.appendChild(boutonSupprimer);

// GÃ©rer la suppression
boutonSupprimer.addEventListener("click", () => {
    panier.splice(i, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
    location.reload();
});

// Assembler les cellules
ligne.appendChild(celluleNom);
ligne.appendChild(cellulePrix);
ligne.appendChild(celluleQuantite);
ligne.appendChild(celluleSousTotal);
ligne.appendChild(celluleAction);

// Ajouter la ligne au tableau
listeProduits.appendChild(ligne);

}

// Calculer les frais de livraison
let livraison = 0;

if (total >= 500) {
    livraison = 0;
} else {
    livraison = 35;
}

// Calculer le total final
totalFinal = total + livraison;

// Afficher les montants
totalProduits.textContent = total + " DH";
fraisLivraison.textContent = livraison + " DH";
prixTotal.textContent = totalFinal + " DH";

