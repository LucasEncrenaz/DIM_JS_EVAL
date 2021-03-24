<?php
header("Content-Type: Application/json");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://futdb.app/api/".$_GET["q"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'X-AUTH-TOKEN: 659d0265-00c3-45e6-933e-4b93e63c0ae0',
));
$output = curl_exec($ch);
echo $output;
curl_close($ch);