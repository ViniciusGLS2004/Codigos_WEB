

var deadline = new Date("jun 8, 2023 15:37:25").getTime();

var x = setInterval(function () {

    var now = new Date().getTime();
    var t = deadline - now;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);

    document.getElementById('dias').innerHTML =days ;
    document.getElementById('horas').innerHTML =hours;
    document.getElementById('minutos').innerHTML =minutes;
    document.getElementById('segundos').innerHTML =seconds;

}, 1000)