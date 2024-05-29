<?php
// Chemin vers le fichier JSON
$file_path = '../../data/listCargo.json';

// Fonction pour lire les données du fichier JSON
function readData() {
    global $file_path;
    if (file_exists($file_path)) {
        $data = file_get_contents($file_path);
        if ($data === false) {
            return ['success' => false, 'message' => 'Erreur lors de la lecture du fichier'];
        }
        $jsonData = json_decode($data, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['success' => false, 'message' => 'Erreur de décodage JSON: ' . json_last_error_msg()];
        }
        return ['success' => true, 'data' => $jsonData];
    } else {
        return ['success' => true, 'data' => []];
    }
}

// Fonction pour écrire les données dans le fichier JSON
function writeData($data) {
    global $file_path;
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return false;
    }
    if (file_put_contents($file_path, $jsonData) === false) {
        return false;
    }
    return true;
}

// Définir l'en-tête de la réponse comme JSON
header('Content-Type: application/json');

// Gérer les requêtes GET pour récupérer les données
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = readData();
    echo json_encode($result);
    exit;
}

// Gérer les requêtes POST pour sauvegarder les données
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Données JSON invalides: ' . json_last_error_msg()]);
        exit;
    }

    if ($data !== null) {
        if (writeData($data)) {
            echo json_encode(['success' => true, 'message' => 'Données sauvegardées avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde des données']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Données invalides']);
    }
    exit;
}

// Si la méthode de requête n'est ni GET ni POST
echo json_encode(['success' => false, 'message' => 'Méthode de requête non autorisée']);
exit;
?>
