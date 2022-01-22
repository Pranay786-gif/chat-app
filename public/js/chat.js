const socket = io()

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
document.querySelector("#form").addEventListener('submit',(e)=>{
    e.preventDefault()
    //for disable the button
    document.querySelector("#submit").setAttribute("disabled","disabled")
   let data= document.querySelector("#inp").value
   socket.emit("messageData",data,(error)=>{
       // for enabled the button
    document.querySelector("#submit").removeAttribute("disabled")
    // for clearing the input field after sending message
    document.querySelector("#inp").value=""
    document.querySelector("#inp").focus()
       if(error){
           return console.log(error)
       }
       console.log("Message was sent")
   })
})

const autoscroll=()=>{
    //new message element
    const $newMessage = document.querySelector("#messages").lastElementChild

    //height of the new messages
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = document.querySelector("#messages").offsetHeight

    // height of message container

    const containerHeight =  document.querySelector("#messages").scrollHeight

    // how far have i scrolled

    const scrollOffset = document.querySelector("#messages").scrollTop + visibleHeight

    if(containerHeight - newMessageHeight<=scrollOffset){
        document.querySelector("#messages").scrollTop = document.querySelector("#messages").scrollHeight
    }

}

socket.on("data",(data)=>{
    console.log(data)
    const html = Mustache.render(document.querySelector("#message-template").innerHTML,{
        message:data.text,
        createdAt:moment(data.createdAt).format('h:mm a'),
        username:data.username
    })
    document.querySelector("#messages").insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on("roomData",({room,users})=>{
    console.log(room)
    console.log(users)
    const html = Mustache.render(document.querySelector("#sidebar-template").innerHTML,{
       room,
       users
       
    })
    document.querySelector("#sidebar").innerHTML=html;
})


document.querySelector("#location").addEventListener('click',()=>{

    // for disable the button
    document.querySelector("#location").setAttribute("disabled","disabled")
  navigator.geolocation.getCurrentPosition((position)=>{
  const location={
      lat:position.coords.latitude,
      lang:position.coords.longitude
  }

  socket.emit("sendLocation",location,()=>{
    document.querySelector("#location").removeAttribute("disabled")
      console.log("location has been sent")
  })
  })
 })

 socket.on("locationMessage",(data)=>{
     console.log(data)
     const html = Mustache.render(document.querySelector("#location-template").innerHTML,{
        locationMessage:data.url,
        createdAt:moment(data.createdAt).format('h:mm a'),
        username:data.username
    })
    document.querySelector("#messages").insertAdjacentHTML("beforeend",html)
    autoscroll()
 })

 socket.emit("join",{username,room},(error)=>{
     if(error){
         alert(error)
         location.href="/"
     }
 })
