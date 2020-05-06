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

document.querySelector('#send-location').addEventListener('click',() => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })

})