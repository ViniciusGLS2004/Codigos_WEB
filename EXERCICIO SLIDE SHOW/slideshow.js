const images = [
    { 'id': '1', 'url':'./img/barata.jpg' },
    { 'id': '2', 'url':'./img/dupla.jpg' },
    { 'id': '3', 'url':'./img/shaco.jpg' },
    { 'id': '4', 'url':'./img/nunu.jpg' },
    { 'id': '5', 'url':'./img/lanterna.jpg' },
    { 'id': '6', 'url':'./img/swain.jpg' },
]

const containerItems = document.querySelector('#container-items');

const loadImages = ( images, container ) => {
    images.forEach ( image => {
        container.innerHTML += `
            <div class='item'>
                <img src='${image.url}'
            </div>
        `
    })
}

loadImages( images, containerItems );

let items = document.querySelectorAll('.item');

const previous = () => {
    const lastItem = items[items.length - 1];
    containerItems.insertBefore( lastItem, items[0] );
    items = document.querySelectorAll('.item');
    
}

const next = () => {
    containerItems.appendChild(items[0]);
    items = document.querySelectorAll('.item');
}

document.querySelector('#previous').addEventListener('click', previous);
document.querySelector('#next').addEventListener('click', next);