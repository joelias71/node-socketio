//connect to the server
const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

socket.on('countUpdated', (count) => {
    console.log('The count has been updated ' + count)
})

document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment')
})

//implicit we have acces to (e) event argument
document.querySelector('#message-form').addEventListener('submit', (e) => {
    //prevent default behavior that is to refresh the browser
    e.preventDefault()

    const message = document.querySelector('input').value

    socket.emit('sendMessage', message)
})