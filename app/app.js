const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
    console.log('WebSocket conectado');
});

socket.addEventListener('error', event => {
    console.error('WebSocket error:', event);
});

socket.addEventListener('close', () => {
    console.warn('WebSocket fechado');
});

function sendMenssage(e) {
    e.preventDefault();
    const input = document.querySelector('input');
    if (input.value) {
        if (socket.readyState !== WebSocket.OPEN) {
            console.error('Conexão WebSocket não está aberta');
            return;
        }
        socket.send(input.value);
        input.value = "";
    }
    input.focus();
}

document.querySelector('form')
    .addEventListener('submit', sendMenssage);

// listen for messages
socket.addEventListener('message', ({ data }) => {
    const li = document.createElement('li');
    li.textContent = data;
    document.querySelector('ul').appendChild(li);
});
