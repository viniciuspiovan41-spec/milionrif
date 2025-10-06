<?php
require("config/sessionToken.php");
session_start();

if (!isset($_SESSION["sessionToken"])) {
    session_set_cookie_params(86400);
}

$_SESSION["sessionToken"] = $sessionToken;

function getCountryFromIP($visitor_ip)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://demo.ip-api.com/json/' . $visitor_ip . '?fields=66842623&lang=en');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Host: demo.ip-api.com',
        'sec-ch-ua: "Not_A Brand";v="99", "Chromium";v="99", ";Not A Brand";v="99"',
        'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36',
        'accept: */*',
        'origin: https://ip-api.com',
        'referer: https://ip-api.com/',
        'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6'
    ));
    curl_setopt($ch, CURLOPT_ENCODING, "gzip");
    $resposta = curl_exec($ch);

    if ($resposta === false) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://db-ip.com/demo/home.php?s=' . $visitor_ip);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_ENCODING, "gzip");
        $resposta = curl_exec($ch);

        if ($resposta === false) {
            return false;
        }
        
        $response = json_decode($resposta);

        if (!$response || !$response->demoInfo->countryCode) {
            return false;
        }

        return $response->demoInfo->countryCode;
    }

    $response = json_decode($resposta);

    if (!$response || !$response->countryCode) {
        return false;
    }

    return $response->countryCode;
}


// IP do visitante
$visitor_ip = $_SERVER['REMOTE_ADDR'];

// Verifica o país do visitante
$visitor_country = getCountryFromIP($visitor_ip);

// Se o visitante não for brasileiro, exibe página de ERRO 404
if ($visitor_country !== "BR") {
    http_response_code(404);
    exit();
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorizando acesso..</title>
</head>

<body>
<script
  src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck
  data-utmify-prevent-subids
  async
  defer
></script>
</body>
</html>

<?php
$utm_source = isset($_GET['utm_source']) ? $_GET['utm_source'] : '';
$utm_medium = isset($_GET['utm_medium']) ? $_GET['utm_medium'] : '';
$utm_campaign = isset($_GET['utm_campaign']) ? $_GET['utm_campaign'] : '';
$utm_term = isset($_GET['utm_term']) ? $_GET['utm_term'] : '';
$utm_content = isset($_GET['utm_content']) ? $_GET['utm_content'] : '';

if ($utm_source || $utm_medium || $utm_campaign || $utm_term || $utm_content) {
    $redirect_url = "./?utm_source=$utm_source&utm_medium=$utm_medium&utm_campaign=$utm_campaign&utm_term=$utm_term&utm_content=$utm_content";
} else {
    $redirect_url = "./";
}

header("Location: $redirect_url");
exit();
?>