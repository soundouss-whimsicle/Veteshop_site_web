// Source de données du catalogue : cette fonction pourra plus tard appeler PHP.
async function chargerProduits() {
    return window.PRODUITS_TEST;
}

function creerCarteProduit(produit) {
    const article = document.createElement("article");
    const image = document.createElement("img");
    image.src = produit.image;
    image.alt = produit.nom;

    const nom = document.createElement("h3");
    nom.textContent = produit.nom;

    const prix = document.createElement("p");
    prix.textContent = `Prix : ${produit.prix} DH`;

    const disponibilite = document.createElement("p");
    disponibilite.textContent = produit.stock > 0 ? "Disponibilité : en stock" : "Disponibilité : épuisé";

    const lien = document.createElement("a");
    lien.href = `fiche-produit.html?id=${encodeURIComponent(produit.id)}`;
    lien.textContent = "Voir le produit";

    article.append(image, nom, prix, disponibilite, lien);
    return article;
}

document.addEventListener("DOMContentLoaded", async () => {
    const fichier = location.pathname.split("/").pop().toLowerCase();
    // Ce fichier est aussi chargé par la fiche produit pour réutiliser chargerProduits().
    if (fichier !== "tops.html" && fichier !== "buttoms.html") return;

    const categorie = fichier === "tops.html" ? "Tops" : "Bottoms";
    const section = document.querySelector("section");
    if (!section) return;

    const produits = await chargerProduits();
    const titre = section.querySelector("h2");
    const titreCategorie = titre.textContent;
    const formulaireRecherche = document.querySelector("#formRecherche");
    const champRecherche = document.querySelector("#rechercheProduits");
    const boutonRecherche = document.querySelector("#boutonRecherche");
    const filtreCategorie = document.querySelector("#filtreCategorie");
    const prixMinimum = document.querySelector("#prixMinimum");
    const prixMaximum = document.querySelector("#prixMaximum");
    const optionsTailles = document.querySelector("#optionsTaillesFiltres");
    const boutonReinitialiser = document.querySelector("#reinitialiserFiltres");
    let filtresUtilises = false;

    // Afficher uniquement les tailles réellement proposées par le catalogue.
    const ordreTailles = ["XS", "S", "M", "L", "XL", "XXL"];
    const taillesDisponibles = [...new Set(produits.flatMap((produit) => produit.tailles))];
    const taillesTriees = [
        ...ordreTailles.filter((taille) => taillesDisponibles.includes(taille)),
        ...taillesDisponibles.filter((taille) => !ordreTailles.includes(taille))
    ];

    taillesTriees.forEach((taille) => {
        const etiquette = document.createElement("label");
        const choix = document.createElement("input");
        choix.type = "checkbox";
        choix.name = "tailleFiltre";
        choix.value = taille;
        etiquette.append(choix, ` ${taille}`);
        optionsTailles.appendChild(etiquette);
    });

    const afficherProduits = (liste, rechercheActive = false) => {
        section.querySelectorAll("article, #messageRecherche").forEach((element) => element.remove());
        titre.textContent = rechercheActive ? "Résultats" : titreCategorie;

        if (liste.length === 0) {
            const message = document.createElement("p");
            message.id = "messageRecherche";
            message.textContent = "Aucun produit trouvé";
            message.setAttribute("aria-live", "polite");
            section.appendChild(message);
            return;
        }

        liste.forEach((produit) => section.appendChild(creerCarteProduit(produit)));
    };

    const normaliser = (texte) => texte
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const appliquerFiltres = () => {
        const terme = normaliser(champRecherche.value.trim());
        const categorieChoisie = filtreCategorie.value;
        const minimum = prixMinimum.value === "" ? null : Number(prixMinimum.value);
        const maximum = prixMaximum.value === "" ? null : Number(prixMaximum.value);
        const taillesChoisies = [...optionsTailles.querySelectorAll('input[name="tailleFiltre"]:checked')]
            .map((choix) => choix.value);
        const filtresActifs = Boolean(
            terme || categorieChoisie || minimum !== null || maximum !== null || taillesChoisies.length
        );

        let resultats = produits;

        // Au premier affichage, chaque page conserve sa catégorie d'origine.
        if (!filtresUtilises && !filtresActifs) {
            resultats = resultats.filter((produit) => produit.categorie === categorie);
        } else if (categorieChoisie) {
            resultats = resultats.filter((produit) => produit.categorie === categorieChoisie);
        }

        if (terme) {
            resultats = resultats.filter((produit) => {
                const texteProduit = normaliser([
                    produit.nom,
                    produit.categorie,
                    ...produit.couleurs
                ].join(" "));
                return texteProduit.includes(terme);
            });
        }

        if (minimum !== null) resultats = resultats.filter((produit) => produit.prix >= minimum);
        if (maximum !== null) resultats = resultats.filter((produit) => produit.prix <= maximum);
        if (taillesChoisies.length) {
            resultats = resultats.filter((produit) =>
                taillesChoisies.some((taille) => produit.tailles.includes(taille))
            );
        }

        afficherProduits(resultats, filtresActifs);
    };

    afficherProduits(produits.filter((produit) => produit.categorie === categorie));
    champRecherche.addEventListener("input", () => {
        filtresUtilises = true;
        appliquerFiltres();
    });
    formulaireRecherche.addEventListener("submit", (event) => {
        event.preventDefault();
        filtresUtilises = true;
        appliquerFiltres();
    });
    boutonRecherche.addEventListener("click", (event) => {
        event.preventDefault();
        filtresUtilises = true;
        appliquerFiltres();
    });

    [filtreCategorie, prixMinimum, prixMaximum, optionsTailles].forEach((element) => {
        element.addEventListener("input", () => {
            filtresUtilises = true;
            appliquerFiltres();
        });
        element.addEventListener("change", () => {
            filtresUtilises = true;
            appliquerFiltres();
        });
    });

    boutonReinitialiser.addEventListener("click", () => {
        champRecherche.value = "";
        filtreCategorie.value = "";
        prixMinimum.value = "";
        prixMaximum.value = "";
        optionsTailles.querySelectorAll("input").forEach((choix) => { choix.checked = false; });
        filtresUtilises = false;
        afficherProduits(produits.filter((produit) => produit.categorie === categorie));
    });
});
