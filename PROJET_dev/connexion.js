const connexion = document.querySelector("#connexion");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const erreur = document.querySelector("#erreur");

connexion.addEventListener("submit", (event) => {
    event.preventDefault();

    const valeurNom = username.value.trim();
    const valeurMotDePasse = password.value.trim();

    if (valeurNom === "" || valeurMotDePasse.length < 8) {
        erreur.textContent = "Vérifiez votre nom d'utilisateur et votre mot de passe (8 caractères minimum).";
        erreur.style.color = "red";
        return;
    }

    // Le formulaire n'est pas encore relié à un endpoint de connexion.
    erreur.textContent = "La vérification de la connexion n'est pas encore disponible.";
    erreur.style.color = "#943B5B";
});
