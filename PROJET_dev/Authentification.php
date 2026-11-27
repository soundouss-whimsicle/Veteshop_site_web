
<?php

require_once "../config/database.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = trim($_POST["nom"]);
    $prenom = trim($_POST["prenom"]);
    $email = trim($_POST["email"]);
    $mot_de_passe = $_POST["mot_de_passe"];

    // Vérifier les champs
    if (empty($nom) || empty($prenom) ||
        empty($email) || empty($mot_de_passe)) {

        $message = "Veuillez remplir tous les champs.";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $message = "Adresse email invalide.";

    } elseif (strlen($mot_de_passe) < 8) {

        $message = "Le mot de passe doit contenir au moins 8 caractères.";

    } else {

        // Vérifier si l'email existe déjà
        $sql = "SELECT id_client FROM clients WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);

        if ($stmt->fetch()) {

            $message = "Cette adresse email est déjà utilisée.";

        } else {

            // Sécuriser le mot de passe
            $password_hash = password_hash(
                $mot_de_passe,
                PASSWORD_DEFAULT
            );

            // Insérer la cliente
            $sql = "INSERT INTO clients
                    (nom, prenom, email, mot_de_passe)
                    VALUES (?, ?, ?, ?)";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $nom,
                $prenom,
                $email,
                $password_hash
            ]);

            $message = "Inscription réussie ! Bienvenue chez Aura Active.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription - Aura Active</title>
</head>

<body>

<h1>Créer un compte Aura Active</h1>

<p><?php echo htmlspecialchars($message); ?></p>

<form method="POST">

    <label>Nom :</label>
    <input type="text" name="nom" required>

    <br><br>

    <label>Prénom :</label>
    <input type="text" name="prenom" required>

    <br><br>

    <label>Email :</label>
    <input type="email" name="email" required>

    <br><br>

    <label>Mot de passe :</label>
    <input type="password" name="mot_de_passe"
           minlength="8" required>

    <br><br>

    <button type="submit">S'inscrire</button>

</form>

</body>
</html>
