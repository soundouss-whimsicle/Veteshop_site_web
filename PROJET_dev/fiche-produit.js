
const image = document.querySelector("#imageProduit");
const erreurCouleur = document.querySelector("#erreurCouleur");
const erreurTaille = document.querySelector("#erreurTaille");

const quantite = document.querySelector("#quantite");
const form = document.querySelector("#form");
const plus = document.querySelector("#plus");
const moins = document.querySelector("#moins");

const nomProduit = document.querySelector("#nomProduit");
const prixProduit = document.querySelector("#prixProduit");
const compteurPanier = document.querySelector("#badgePanier");

// Afficher le total déjà présent au chargement de la fiche
let panierInitial = JSON.parse(localStorage.getItem("panier")) || [];
let totalArticles = panierInitial.reduce((total, produit) => total + (Number(produit.quantite) || 0), 0);
compteurPanier.textContent = totalArticles;

// Gestion de la soumission du formulaire
form.addEventListener("submit", (event) => {

    erreurCouleur.textContent = "";
    erreurTaille.textContent = "";

    const couleur = document.querySelector('input[name="couleur"]:checked');
    const taille = document.querySelector('input[name="taille"]:checked');

    let valide = true;

    if (couleur === null) {
        valide = false;
        erreurCouleur.textContent = "Vous devez choisir une couleur";
    }

    if (taille === null) {
        valide = false;
        erreurTaille.textContent = "Vous devez choisir une taille";
    }

    if (valide === false) {
        event.preventDefault();
        return;
    }

    // EmpÃªcher temporairement l'envoi vers PHP
    event.preventDefault();

    // Construire l'objet produit
    const produit = {
        nom: nomProduit.textContent,
        prix: Number(prixProduit.textContent),
        couleur: couleur.value,
        taille: taille.value,
        quantite: Number(quantite.value)
    };

    // RÃ©cupÃ©rer le panier existant
    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    // Ajouter le produit
    panier.push(produit);

    // Enregistrer le panier
    localStorage.setItem("panier", JSON.stringify(panier));
    // Calculer le nombre d'articles
    let nombreArticles = 0;

     for (let i = 0; i < panier.length; i++) {
     nombreArticles += panier[i].quantite;
}

// Afficher le nombre d'articles
compteurPanier.textContent = nombreArticles;

});

// Bouton +
plus.addEventListener("click", () => {
    quantite.value = Number(quantite.value) + 1;
});

// Bouton -
moins.addEventListener("click", () => {
    if (Number(quantite.value) > 1) {
        quantite.value = Number(quantite.value) - 1;
    }
});

// Zoom de l'image
image.addEventListener("mouseover", () => {
    image.classList.add("zoom");
});

image.addEventListener("mouseout", () => {
    image.classList.remove("zoom");
});



