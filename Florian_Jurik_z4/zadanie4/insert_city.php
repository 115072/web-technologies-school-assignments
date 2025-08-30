<?php
include 'db_connect.php'; // Include the database connection file

function insertCityInformation($conn) {
    // Check if cityInput and countryInput are set in the GET parameters
    if (isset($_GET['cityInput']) && isset($_GET['countryInput'])) {
        $cityName = $_GET['cityInput'];
        $countryName = $_GET['countryInput'];

        // Make sure to sanitize user input to prevent SQL injection
        $cityName = $conn->real_escape_string($cityName);
        $countryName = $conn->real_escape_string($countryName);

        // Insert city information into the database
        $sql = "INSERT INTO holidays (destination, country) VALUES ('$cityName', '$countryName')";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "City name or country name not provided";
    }
}

insertCityInformation($conn); // Call the function
?>
