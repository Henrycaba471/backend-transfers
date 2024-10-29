function convertirSinSeparador(valor) {
    const numeroSinSeparador = valor.replace(/\./g, '');
    return parseInt(numeroSinSeparador, 10); // Base decimal explícita
}

function formatAccount(input) {
    input.value = input.value.replace(/[^0-9\-]/g, ""); // Solo números y guiones
    input.value = input.value.replace(/-/g, ""); // Elimina guiones previos

    const matches = input.value.match(/.{1,4}/g);
    if (matches) {
        input.value = matches.join("-");
    }
}

function separardorMiles(input) {
    if (input.value === "") {
        return;
    }
    input.value = input.value.replace(/[^0-9]/g, "");
    input.value = Number(input.value).toLocaleString("es-CO");
}

module.exports = {
    convertirSinSeparador,
    formatAccount,
    separardorMiles
}