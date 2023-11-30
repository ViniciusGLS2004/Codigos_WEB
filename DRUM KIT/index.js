const sons = {
    'Q': '1.wav',
    'W': '2.wav',
    'E': '3.wav',
    'R': '4.wav',
    'T': '5.wav',
    'Y': '6.wav',
    'U': '7.wav',
    'I': '8.wav',
    'O': '9.wav',
    'P': '10.wav',
    'A': '11.wav',
    'S': 'clap.wav',
    'D': 'hihat.wav',
    'F': 'kick.wav',
    'G': 'openhat.wav',
    'H': 'ride.wav',
    'J': 'snare.wav',
    'K': 'tink.wav',
    'L': 'tom.wav',
    'Z': 'boom.wav',
    'X': '2.wav',
    'C': '3.wav',
    'V': '4.wav',
    'B': '5.wav',
    'N': '6.wav',
    'M': '7.wav',
}

const criarDiv = (texto) => {
    const div = document.createElement('div');
    div.classList.add('key');
    div.textContent = texto;
    div.id = texto;
    document.getElementById('container').appendChild(div);
}

const exibir = (sons) => Object.keys(sons).forEach(criarDiv);

const tocarSom = (letra) => {
    const audio = new Audio(`./sounds/${sons[letra]}`);
    audio.play();
}

const adicionarEfeito = (letra) => document.getElementById(letra)
    .classList.toggle('active');

const removerEfeito = (letra) => {
    const div = document.getElementById(letra);
    const removeActive = () => div.classList.remove('active');
    div.addEventListener('transitionend', removeActive);
};

const ativarDiv = (evento) => {

    const letra = evento.type == 'click' ? evento.target.id : evento.key.toUpperCase();

    const letraPermitida = sons.hasOwnProperty(letra);
    if (letraPermitida) {
        adicionarEfeito(letra);
        tocarSom(letra);
        removerEfeito(letra);
    }
}


exibir(sons);
document.getElementById('container')
    .addEventListener('click', ativarDiv);

window.addEventListener('keyup', ativarDiv);