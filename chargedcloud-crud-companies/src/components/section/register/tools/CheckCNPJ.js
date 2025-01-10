function CheckCNPJ(input) {
    //As condicoes de validacao do CNPJ e o "Algoritmo de Validacao" é creditado no repositorio
    //Eu apenas modelei para meu estilo de programação, mas credito todo o merito ao autor!

    //Substitui os caracteres não numéricos por nada (para ficar apenas os numeros)
    input = input.replace(/[^\d]+/g, '');

    //Se possuir menos de 14 digitos ja é possivel afirmar que não é um CNPJ valido
    if (input.length !== 14)
        return false;

    //Se possuir todos os numeros iguais o fator de calculo do CNPJ ja esta invalido
    if (/^(\d)\1+$/.test(input))
        return false;

    // Validar as DVs
    tamanho = input.length - 2
    numeros = input.substring(0, tamanho);
    digitos = input.substring(tamanho);

    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    //Verificando a validade do primeiro digito
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = input.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    //Verificando a validade do segundo digito
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}