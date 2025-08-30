<?php
$servername = "localhost"; // Change this to your MySQL server hostname
$username = "xjurikf"; // Change this to your MySQL username
$password = "asd"; // Change this to your MySQL password
$database = "webte2_zadanie4"; // Change this to your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
