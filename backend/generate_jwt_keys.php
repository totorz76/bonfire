<?php

putenv('OPENSSL_CONF=C:\php8.5\extras\ssl\openssl.cnf');
putenv('OPENSSL_CONF_FILE=C:\php8.5\extras\ssl\openssl.cnf');

$config = [
    "private_key_bits" => 4096,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
];

$res = openssl_pkey_new($config);

if (!$res) {
    while ($msg = openssl_error_string()) {
        echo $msg . PHP_EOL;
    }
    die("Erreur lors de la génération de la clé\n");
}

openssl_pkey_export($res, $privateKey);

$publicKeyDetails = openssl_pkey_get_details($res);
$publicKey = $publicKeyDetails["key"];

if (!is_dir(__DIR__ . '/config/jwt')) {
    mkdir(__DIR__ . '/config/jwt', 0777, true);
}

file_put_contents(__DIR__ . '/config/jwt/private.pem', $privateKey);
file_put_contents(__DIR__ . '/config/jwt/public.pem', $publicKey);

echo "Clés JWT générées avec succès !\n";
