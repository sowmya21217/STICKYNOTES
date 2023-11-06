<?php
// Create a file to store the notes if it doesn't exist
$filename = 'notes.json';
if (php_sapi_name() === 'cli') {
    // Handle command-line execution (if needed)
} else {
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER["REQUEST_METHOD"] == 'POST'){
    $noteContent = $_POST["noteContent"];

    // Load existing notes from the file or initialize an empty array
    $notes = loadNotes($filename);

    // Add a new note to the array
    $newNote = [
        "content" => $noteContent,
        "color" => "yellow",
        "left" => "50px",
        "top" => "50px",
    ];
    $notes[] = $newNote;

    // Save the updated notes array to the file
    saveNotes($filename, $notes);

    echo "Note saved successfully!";
}

elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Retrieve notes from the file
    $notes = loadNotes($filename);

    // Inject text into every 5th note
    $noteCount = count($notes);
    for ($i = 4; $i < count($notes); $i += 5) {
        $notes[$i]["content"] = "This is the " . ($i + 1) . "th note.";
    }

    // Return notes as JSON
    echo json_encode($notes);
}}

function loadNotes($filename) {
    if (file_exists($filename)) {
        $data = file_get_contents($filename);
        return json_decode($data, true);
    }
    return [];
}

function saveNotes($filename, $notes) {
   if( file_put_contents($filename, json_encode($notes, JSON_PRETTY_PRINT))=== false) {
    error_log("Error saving notes to the file.");
    echo "Error saving notes to the file.";
} else {
    echo "Note saved successfully!";
}
}
$fileContents = file_get_contents($filename);
echo $fileContents;
?>

