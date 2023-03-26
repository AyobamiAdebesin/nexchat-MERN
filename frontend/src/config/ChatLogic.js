// Return the name of the second user in the chat
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Return the profile details of the second user in the chat
export const getFullSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

/**
 * Check if the message is the last message in the array
 * Check if the next message is from the same user
 * Check if the current message is from the same user
 * @param {Array} messages
 * @param {Object} m
 * @param {Number} i
 * @param {String} userId
 * @returns {Boolean}
 */
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

/**
 * Check if the message is the last message in the array
 * Check if the current message is from the same user
 * @param {Array} messages
 * @param {Number} i
 * @param {String} userId
 * @returns {Boolean}
 */
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
