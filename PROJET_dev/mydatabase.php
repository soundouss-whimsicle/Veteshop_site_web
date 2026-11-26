
<?php
try {
    $bdd = new PDO("mysql:host=localhost;dbname=test;charset=utf8", "root", "");
} 
catch (PDOException $e) 
{
    die("Erreur de connexion à la base de données.");
}
?>