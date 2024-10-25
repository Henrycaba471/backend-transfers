function convertirSinSeparador(valor) {
    const numeroSinSeparador = valor.replace(/\./g, '');
    return parseInt(numeroSinSeparador, 10); // Base decimal explícita
}

module.exports = {
    convertirSinSeparador
}