//connect to the server
const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

//implicit we have acces to (e) event argument
document.querySelector('#message-form').addEventListener('submit', (e) => {
    //prevent default behavior that is to refresh the browser
    e.preventDefault()

    //target = form
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
})