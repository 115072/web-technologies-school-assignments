<?php

// Database connection parameters
$dbhost = 'localhost';
$dbuser = 'xjurikf';
$dbpass = 'asd';
$dbname = 'webte2_2';

// Connect to the database
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/zadanie2/api/schedule') {
    handleGetRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && strpos($_SERVER['REQUEST_URI'], 'zadanie2/api/schedule/') !== false) {
    handleDeleteRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'],'zadanie2/api/schedule') !== false) {
    handlePostRequest($conn);
}elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && strpos($_SERVER['REQUEST_URI'],'zadanie2/api/schedule') !== false) {
    deleteEverything($conn);
}
 elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH' && strpos($_SERVER['REQUEST_URI'], 'zadanie2/api/schedule/') !== false) {
    handlePatchRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], 'zadanie2/api/finalthesis/') !== false) {
    handleFinalThesisRequest($conn);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], 'zadanie2/api/schedule/') !== false) {
    echo "szoker";
    getDataToDatabase($conn);
}
else {
    // Handle other cases or return an error
    echo json_encode(array("error" => "Invalid request."), JSON_UNESCAPED_UNICODE);
}

// Close the database connection
$conn->close();

// Function to handle GET requests
function handleGetRequest($conn) {
    $sql = "SELECT * FROM hodiny";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(array());
    }
}

// Function to handle DELETE requests
function handleDeleteRequest($conn) {
    $request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
    $id = end($request_uri);
    $sql = "DELETE FROM hodiny WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Record with ID $id deleted successfully"));
    } else {
        echo json_encode(array("error" => "Error deleting record: " . $conn->error));
    }
}

// Function to handle POST requests
function handlePostRequest($conn) {
    $postData = file_get_contents("php://input");
    $postDataArray = json_decode($postData, true);
    $den = $postDataArray['den'];
    $od = $postDataArray['od'];
    $do = $postDataArray['do'];
    $predmet = $postDataArray['predmet'];
    $akcia = $postDataArray['akcia'];
    $miestnost = $postDataArray['miestnost'];
    $vyucujuci = $postDataArray['vyucujuci'];
    $restriction = $postDataArray['restriction'];
    $capacity = $postDataArray['capacity'];
    // Extract other fields here...
    $sql = "INSERT INTO hodiny (den, od, do, predmet, akcia, miestnost, vyucujuci, restriction, capacity) 
    VALUES ('$den', '$od', '$do', '$predmet', '$akcia', '$miestnost', '$vyucujuci', '$restriction', '$capacity')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "New record added successfully"));
    } else {
        echo json_encode(array("error" => "Error adding record: " . $conn->error));
    }
}

// Function to handle PATCH requests
function handlePatchRequest($conn) {
    $request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
    $id = end($request_uri);
    $patchData = file_get_contents("php://input");
    $patchDataArray = json_decode($patchData, true);
    $fieldsToUpdate = '';
    foreach ($patchDataArray as $key => $value) {
        if ($key !== 'id') {
            $fieldsToUpdate .= "$key = '$value', ";
        }
    }
    $fieldsToUpdate = rtrim($fieldsToUpdate, ', ');
    $sql = "UPDATE hodiny SET $fieldsToUpdate WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Record with ID $id updated successfully"));
    } else {
        echo json_encode(array("error" => "Error updating record: " . $conn->error));
    }
}

// Function to handle Final Thesis requests
function handleFinalThesisRequest($conn) {
// Get the path from the URL
$request_uri = $_SERVER['REQUEST_URI'];
$path_components = explode('/', $request_uri);

// Check if the path is as expected
if(count($path_components) >= 5 && $path_components[count($path_components) - 2] === 'finalthesis'){
    $pracoviste = $path_components[count($path_components) - 1];
    $url = "https://is.stuba.sk/pracoviste/prehled_temat.pl?lang=sk;pracoviste={$pracoviste}";
} else {
    // If the path doesn't match the expected format, return an error message
    echo json_encode(array("error" => "Invalid URL format. Expected format: /finalthesis/{pracoviste}"), JSON_UNESCAPED_UNICODE);
    exit();
}

// Initialize cURL session
$curl = curl_init();

// Set the cURL options
curl_setopt($curl, CURLOPT_URL, $url); // URL to fetch
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); // Return the transfer as a string
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true); // Follow redirects

// Execute the request
$response = curl_exec($curl);

// Check for errors
if ($response === false) {
    echo json_encode(array("error" => "Error fetching data: " . curl_error($curl)));
    exit();
}

// Close cURL session
curl_close($curl);

// Parse the HTML to extract the tables
$doc = new DOMDocument();
@$doc->loadHTML('<?xml encoding="UTF-8">' . $response, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
$doc->encoding = 'UTF-8';
$tables = $doc->getElementsByTagName('table');

// Data array to hold extracted information
$data = array();

// Assuming you want the third table, you can modify this logic as needed
if ($tables->length > 3) {
    $table = $tables->item(3); // forth table
    $rows = $table->getElementsByTagName('tr');
    
    // Output selected columns
    for ($i = 1; $i < $rows->length; $i++) { // Start from 1 to skip header row
        $cells = $rows->item($i)->getElementsByTagName('td');
        $obsadeneMaxCell = $cells->item(9)->textContent; // Assuming "Obsadené/Max" column is the 10th column (index 9)
        
        // Filter out rows with "--" in the "Obsadené/Max" column
        if (strpos($obsadeneMaxCell, '--') !== false) {
            $row = array(
                "nazovTemy" => $cells->item(2)->textContent, // Názov témy column
                "veduciPrace" => $cells->item(3)->textContent, // Vedúci práce column
                "garantujucePracovisko" => $cells->item(4)->textContent, // Garantujúce pracovisko column
                "program" => $cells->item(5)->textContent, // Program column
                "zameranie" => $cells->item(6)->textContent, // Zameranie column
            );

            $detailLinkIndex = in_array($pracoviste, array('642', '548', '816', '817')) ? 8 : 7; // Dynamically set index based on $pracoviste value
            // Get link to detail page
            $detailLink = $cells->item($detailLinkIndex)->getElementsByTagName('a')->item(0)->getAttribute('href');
            $detailUrl = "https://is.stuba.sk" . $detailLink;
            
            // Fetch detail page content
            @$detailResponse = file_get_contents($detailUrl);
            $detailDoc = new DOMDocument();
            @$detailDoc->loadHTML('<?xml encoding="UTF-8">' . $detailResponse, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            $detailDoc->encoding = 'UTF-8';
            
            // Find and extract abstract text
            $abstract = "";
            $abstractDiv = $detailDoc->getElementById('base-r');
            if ($abstractDiv) {
                $abstractTable = $abstractDiv->getElementsByTagName('table')->item(0);
                if ($abstractTable) {
                    $abstractTd = $abstractTable->getElementsByTagName('td')->item(21); // Assuming abstract is in the 8th column
                    if ($abstractTd) {
                        $abstract = $abstractTd->nodeValue;
                    }
                }
            }

            // Find and extract Typ text
            $typ = "";
            $typDiv = $detailDoc->getElementById('base-r');
            if ($typDiv) {
                $typTable = $typDiv->getElementsByTagName('table')->item(0);
                if ($typTable) {
                    $typTd = $typTable->getElementsByTagName('td')->item(1); // Assuming typ is in the 1st column
                    if ($typTd) {
                        $typ = $typTd->nodeValue;
                    }
                }
            }

            $row["typ"] = $typ; // Add Typ to the row data
            $row["obsadeneMax"] = $obsadeneMaxCell; // Add Obsadené/Max to the row data
            $row["abstract"] = $abstract; // Add abstract to the row data
            
            // Add row data to the main data array
            $data[] = $row;
        }
        
        // Filter out rows where the left number is smaller than the right in the "Obsadené/Max" column
        elseif (preg_match('/(\d+) \/ (\d+)/', $obsadeneMaxCell, $matches)) {
            $leftNumber = intval($matches[1]); // Extract the left number
            $rightNumber = intval($matches[2]); // Extract the right number
            if ($leftNumber < $rightNumber) {
                $row = array(
                    "nazovTemy" => $cells->item(2)->textContent, // Názov témy column
                    "veduciPrace" => $cells->item(3)->textContent, // Vedúci práce column
                    "garantujucePracovisko" => $cells->item(4)->textContent, // Garantujúce pracovisko column
                    "program" => $cells->item(5)->textContent, // Program column
                    "zameranie" => $cells->item(6)->textContent, // Zameranie column
                );
                
                $detailLinkIndex = in_array($pracoviste, array('642', '548', '816', '817')) ? 8 : 7; // Dynamically set index based on $pracoviste value
                // Get link to detail page
                $detailLink = $cells->item($detailLinkIndex)->getElementsByTagName('a')->item(0)->getAttribute('href');
                $detailUrl = "https://is.stuba.sk" . $detailLink;
                
                // Fetch detail page content
                $detailResponse = file_get_contents($detailUrl);
                $detailDoc = new DOMDocument();
                @$detailDoc->loadHTML('<?xml encoding="UTF-8">' . $detailResponse, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
                $detailDoc->encoding = 'UTF-8';
                
                // Find and extract abstract text
                $abstract = "";
                $abstractDiv = $detailDoc->getElementById('base-r');
                if ($abstractDiv) {
                    $abstractTable = $abstractDiv->getElementsByTagName('table')->item(0);
                    if ($abstractTable) {
                        $abstractTd = $abstractTable->getElementsByTagName('td')->item(21); // Assuming abstract is in the 8th column
                        if ($abstractTd) {
                            $abstract = $abstractTd->nodeValue;
                        }
                    }
                }

                // Find and extract Typ text
                $typ = "";
                $typDiv = $detailDoc->getElementById('base-r');
                if ($typDiv) {
                    $typTable = $typDiv->getElementsByTagName('table')->item(0);
                    if ($typTable) {
                        $typTd = $typTable->getElementsByTagName('td')->item(1); // Assuming typ is in the 1st column
                        if ($typTd) {
                            $typ = $typTd->nodeValue;
                        }
                    }
                }

                $row["typ"] = $typ; // Add Typ to the row data
                $row["obsadeneMax"] = $obsadeneMaxCell; // Add Obsadené/Max to the row data
                $row["abstract"] = $abstract; // Add abstract to the row data
                
                // Add row data to the main data array
                $data[] = $row;
            }
        }
    }
    
    // Output data as JSON
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array("error" => "No third table found on the page."), JSON_UNESCAPED_UNICODE);
}
}

function getDataToDatabase($conn){
//Define database connection details

$database = "webte2_2";
$table_name = "hodiny";

    $username = 'xjurikf';
    $database = 'webte2_2'; // Replace 'your_database' with your actual database name
    $table_name = 'hodiny'; // Replace 'your_table_name' with your actual table name

    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
   // var_dump($url_parts);
    $password = end($url_parts);
    
    // Login
    $loginUrl = "https://is.stuba.sk/system/login.pl";
    $targetUrl = "https://is.stuba.sk/auth/katalog/rozvrhy_view.pl?rozvrh_student_obec=1?zobraz=1;format=html;rozvrh_student=115072;lang=sk";
    
    $ch = curl_init();
    
    // Login request
    curl_setopt($ch, CURLOPT_URL, $loginUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, 'lang=sk&login_hidden=1&auth_2fa_type=no&credential_0=' . urlencode($username) . '&credential_1=' . urlencode($password));
    curl_setopt($ch, CURLOPT_COOKIEJAR, realpath('cookie.txt'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);

    
    // Check for cURL errors after login request
    if (curl_errno($ch)) {
        // Log the error or handle it as required, without outputting to the user
        // Example: error_log('cURL error (' . curl_errno($ch) . '): ' . curl_error($ch));
        curl_close($ch);
        exit(); // Stop execution if there's a cURL error
    }
    
    // Simulate clicking the "Zobraziť" button by sending POST data
    $formData = [
        'lang' => 'sk',
        'rozvrh_student' => '115072',
        'rozvrh_student_obec' => '1',
        'format' => 'list',
        'zobraz' => 'Zobraziť'
    ];
    
    curl_setopt($ch, CURLOPT_URL, $targetUrl); // Use the same target URL as before
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
    
    $content = curl_exec($ch);


    
    // Check for errors after fetching the page
    if ($content === false) {
        // Log the error or handle it as required, without outputting to the user
        // Example: error_log('cURL error (' . curl_errno($ch) . '): ' . curl_error($ch));
        curl_close($ch);
        exit(); // Stop execution if there's a cURL error
    } else {
        // Parse the content and insert data into the database
        
        $dom = new DOMDocument();
        @$dom->loadHTML($content); // Use '@' to suppress warnings
        
        $tableNodes = $dom->getElementsByTagName('table');
        if ($tableNodes->length > 0) {
            $table = $tableNodes->item(0);
            
            // Extract data from the table and insert into the database
            $rows = $table->getElementsByTagName('tr');
            foreach ($rows as $row) {
                $cells = $row->getElementsByTagName('td');
                if ($cells->length > 0) {
                    $columns = array();
                    foreach ($cells as $cell) {
                        $columns[] = $cell->textContent;
                    }
                    // Insert $columns into the database
                    insertRecord($columns, $database, $table_name);
                }
            }
        } else {
            // Log the error or handle it as required, without outputting to the user
            // Example: error_log('Table not found.');
        }
    }
    
    // Close cURL session
    curl_close($ch);
    
    exit();
}

// Function to insert record into the database
function insertRecord($data, $database, $table_name) {
    $servername = "localhost";
    $db_username = "xjurikf";
    $db_password = "asd";

    // Create connection
    $conn = new mysqli($servername, $db_username, $db_password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind the insert statement dynamically
    $sql = "INSERT INTO $table_name (den, od, do, predmet, akcia, miestnost, vyucujuci, restriction, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7], $data[8]);

    // Execute the statement
    $stmt->execute();

    // Close statement and connection
    $stmt->close();
    $conn->close();
}

function deleteEverything($conn) {
    $sql = "DELETE FROM hodiny";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "All records deleted successfully"));
    } else {
        echo json_encode(array("error" => "Error deleting records: " . $conn->error));
    }
}

?>

