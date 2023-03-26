// Return the name of the second user in the chat
export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

// Return the profile details of the second user in the chat
export const getFullSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}