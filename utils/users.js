
const users = []

//join user
const userJoin = (id,name,room) => {
    const user = {id,name,room}
    users.push(user)
    return user
}

//get user
const getCurrentUser = (roomId) => {
    return users.find(user=>user.id===roomId)
}

//get room users
const getRoomUsers = (room) =>{
    return users.filter(user=>user.room===room)
}

//user leave room
const userLeave = (roomId) =>{
    const index = users.findIndex(user=>user.id===roomId)

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}