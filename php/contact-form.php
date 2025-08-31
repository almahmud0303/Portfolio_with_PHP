<?php
// Load Composer's autoloader
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Database connection
    $servername = "localhost";
    $username = "root";
    $password = ""; // Default XAMPP password is empty
    $dbname = "portfolio_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $message);

    $dbSuccess = $stmt->execute();

    $stmt->close();
    $conn->close();

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'lazy21226@gmail.com'; // Your Gmail
        $mail->Password   = 'tzzg kzmo imoc jjhm'; // Your Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        //Recipients
        $mail->setFrom('lazy21226@gmail.com', 'Abdullah Al Mahmud');
        $mail->addAddress('lazy21226@gmail.com', 'Abdullah Al Mahmud');

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Message from $name";
        $mail->Body    = "You have received a new message from your portfolio contact form:<br><br>"
                       . "Name: $name<br>"
                       . "Email: $email<br>"
                       . "Message:<br>$message";
        $mail->AltBody = "You have received a new message from your portfolio contact form:\n\n"
                       . "Name: $name\n"
                       . "Email: $email\n"
                       . "Message:\n$message";

        $mailSuccess = $mail->send();
    } catch (Exception $e) {
        $mailSuccess = false;
        echo "Mailer Error: " . $mail->ErrorInfo;
    }

    if ($dbSuccess && $mailSuccess) {
        echo "Thank you for contacting me, $name. I will get back to you soon!";
    } elseif ($dbSuccess) {
        echo "Message saved, but email could not be sent.";
    } else {
        echo "Sorry, there was an error saving your message. Please try again later.";
    }
} else {
    echo "Invalid request.";
}
?>