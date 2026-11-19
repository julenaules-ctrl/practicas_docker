<?php
$nombre = $_POST["nombre"] ?? "";
$correo = $_POST["correo"] ?? "";
$actividad = $_POST["actividad"] ?? "";
$turno = $_POST["turno"] ?? "";
$observaciones = $_POST["observaciones"] ?? "";

function limpiar($dato) {
    return htmlspecialchars($dato, ENT_QUOTES, "UTF-8");
}

$materiales = [
    "portatil"    => "Ordenador portátil",
    "auriculares" => "Auriculares",
    "escritura"   => "Material de escritura"
];

$materialSeleccionado = [];
$total = 0;

foreach ($materiales as $clave => $nombreMaterial) {
    if (isset($_POST[$clave])) {
        $valor = (int) $_POST[$clave];
        $materialSeleccionado[$nombreMaterial] = $valor;
        $total += $valor;
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumen de la inscripción</title>
    <link rel="stylesheet" href="estilos.css">
</head>

<body>

    <div class="contenedor">

        <h1>Resumen de la inscripción</h1>

        <p class="descripcion">
            El servidor ha recibido los datos enviados desde el formulario.
        </p>

        <div class="resultado">

            <div class="dato">
                <span class="etiqueta">Nombre y apellidos:</span>
                <span><?= limpiar($nombre) ?></span>
            </div>

            <div class="dato">
                <span class="etiqueta">Correo electrónico:</span>
                <span><?= limpiar($correo) ?></span>
            </div>

            <div class="dato">
                <span class="etiqueta">Actividad:</span>
                <span><?= limpiar($actividad) ?></span>
            </div>

            <div class="dato">
                <span class="etiqueta">Turno:</span>
                <span><?= limpiar($turno) ?></span>
            </div>

            <div class="dato">
                <span class="etiqueta">Material:</span>
                <?php if (count($materialSeleccionado) === 0): ?>
                    <span>Sin material adicional</span>
                <?php else: ?>
                    <ul>
                        <?php foreach ($materialSeleccionado as $nombreMaterial => $valor): ?>
                            <li><?= limpiar($nombreMaterial) ?> (<?= $valor ?> €)</li>
                        <?php endforeach; ?>
                    </ul>
                    <span class="total">Total: <?= $total ?> €</span>
                <?php endif; ?>
            </div>

            <?php if (trim($observaciones) !== ""): ?>
            <div class="dato">
                <span class="etiqueta">Observaciones:</span>
                <span><?= limpiar($observaciones) ?></span>
            </div>
            <?php endif; ?>

        </div>

        <div class="botones">
            <a href="index.html" class="boton-enlace">
                Volver al formulario
            </a>
        </div>

        <p class="nota">
            Esta página se ha generado en el servidor mediante PHP.
        </p>

    </div>

</body>
</html>
