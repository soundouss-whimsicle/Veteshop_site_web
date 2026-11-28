
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
const descriptionProduit = document.querySelector("#descriptionProduit");
const disponibiliteProduit = document.querySelector("#disponibiliteProduit");
const idProduit = document.querySelector("#idProduit");
const formulaireProduit = document.querySelector("#form");
let produitSelectionne = null;

// Charger le produit demandé dans l'URL, par exemple fiche-produit.html?id=101.
const identifiantDemande = new URLSearchParams(window.location.search).get("id");
chargerProduits().then((produits) => {
    produitSelectionne = produits.find((produit) => String(produit.id) === identifiantDemande);

    if (!produitSelectionne) {
        nomProduit.textContent = "Produit introuvable";
        descriptionProduit.textContent = "Choisissez un produit depuis une page de catégorie.";
        formulaireProduit.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    nomProduit.textContent = produitSelectionne.nom;
    prixProduit.textContent = produitSelectionne.prix;
    descriptionProduit.textContent = produitSelectionne.description;
    image.src = produitSelectionne.image;
    image.alt = produitSelectionne.nom;
    idProduit.value = produitSelectionne.id;
    quantite.max = Math.min(produitSelectionne.stock, 10);
    disponibiliteProduit.textContent = produitSelectionne.stock > 0
        ? `Disponibilité : en stock (${produitSelectionne.stock})`
        : "Disponibilité : épuisé";

    const ajouterOptions = (conteneur, nomChamp, options) => {
        conteneur.replaceChildren();
        options.forEach((valeur, index) => {
            const etiquette = document.createElement("label");
            const choix = document.createElement("input");
            choix.type = "radio";
            choix.name = nomChamp;
            choix.value = valeur;
            choix.id = `${nomChamp}-${index}`;
            etiquette.htmlFor = choix.id;
            etiquette.append(choix, ` ${valeur} `);
            conteneur.appendChild(etiquette);
        });
    };

    ajouterOptions(document.querySelector("#optionsCouleur"), "couleur", produitSelectionne.couleurs);
    ajouterOptions(document.querySelector("#optionsTaille"), "taille", produitSelectionne.tailles);
    formulaireProduit.querySelector('button[type="submit"]').disabled = produitSelectionne.stock <= 0;
});

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
        id: produitSelectionne.id,
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
    if (produitSelectionne && Number(quantite.value) < Math.min(produitSelectionne.stock, 10)) {
        quantite.value = Number(quantite.value) + 1;
    }
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



