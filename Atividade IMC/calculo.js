function calculaIMC() {
    var peso = Number(document.FormIMC.peso.value.replace(",", "."));
    var altura = Number(document.FormIMC.altura.value.replace(",", "."));
    var imc = peso / (altura * altura);
    document.FormIMC.resultado.value = imc.toFixed(2);

    if (imc < 17) {

        document.getElementById("imc").src = "imc1.png";

    } else if (imc >= 17 && imc < 18.49) {

        document.getElementById("imc").src = "imc2.png";

    } else if (imc >= 18.5 && imc < 24.99) {
        
        document.getElementById("imc").src = "imc3.png";

    } else if (imc >= 25 && imc < 29.99) {
        
        document.getElementById("imc").src = "imc4.png";

    } else if (imc >= 30 && imc < 34.99) {

        document.getElementById("imc").src = "imc5.png";

    } else if (imc >= 35 && imc < 39.99) {

        document.getElementById("imc").src = "imc6.png";
    }
}

function resetimage(){
    document.getElementById("imc").src = "imc.png";
}



