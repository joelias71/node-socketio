//connect to the server
const socket = io()

//Elments
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.on('message', (message) => {
    //store html that is going to be render using moustache
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (link) => {
    const html = Mustache.render(locationMessageTemplate,{
        username: link.username,
        link: link.location,
        createdAt: moment(link.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

//implicit we have acces to (e) event argument
$messageForm.addEventListener('submit', (e) => {
    //prevent default behavior that is to refresh the browser
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    //target = form
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (msg) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        console.log('The message was delivered! ', msg)
    })
})

$sendLocationButton.addEventListener('click',() => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared !')
        })
    })

})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})