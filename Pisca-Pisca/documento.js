function Titulo() {
    document.write("<h1 aling=center><I>Lampada Pisca-Pisca</I></h1>");
}

function on() {
    document.getElementById("Lamp").src = "on.jpg";
}

function off() {
    document.getElementById("Lamp").src = "off.jpg";
}


function blink() {
    var intervalo = 10;
    var contador = 0;
    while (contador < 10) {
        intervalo += 300;
        setTimeout("document.getElementById('Lamp').src = 'on.jpg';", intervalo);
        intervalo += 300;
        setTimeout("document.getElementById('Lamp').src = 'off.jpg';", intervalo);
        contador++;
    }
}