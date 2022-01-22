const users=[]

const addUser=({id,username,room})=>{

    //clean the data
     room=room.trim().toLowerCase();
     username=username.trim().toLowerCase();

     // validate the data

     if(!username||!room){
         return {
             error:"Username and name are required"
         }
     }

     // check for existing user
     
     const existingUser = users.find((user)=>{
         return user.room===room && user.username===username
     })

     // validate username

     if(existingUser){
         return{
             error:"username is in use"
         }
     }

     // store user
     const user={id,username,room}
     users.push(user)
     return{
         user
     }

}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>user.id===id)

    if(index!==-1){
        return users.splice(index,1)[0]
    }

}

const getUser =(id)=>{
    const user = users.filter((user)=>{
        return user.id===id
    })
    if(user==[]){
        return undefined
    }
    return user[0]
}

const getUsersInRoom=(room)=>{
   room = room.trim().toLowerCase()
    const allUsers = users.filter((user)=>{
       return user.room===room
    })
    return allUsers

}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}