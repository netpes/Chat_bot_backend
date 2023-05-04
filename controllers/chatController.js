const chatsSchema = require("../schema/chatsSchema");
const userSchema = require("../schema/signupSchema");
const { unstable_ClassNameGenerator } = require("@mui/material");

module.exports = {
  getChatData: (userId) => {
    try {
      return chatsSchema
        .findOne({ user: userId })
        .then((chats) => {
          return chats?.chat;
        })
        .catch((error) => {
          return console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  },
  convertSender: (ID) => {
    try {
      console.log(`hey! this is my id `, ID);
      return userSchema.findById(ID).then((user) => {
        // console.log("this is user ", user.name);
        return user;
      });
    } catch (err) {
      console.log(err);
    }
  },
  // (msg, room, sender, admin, time, date, senderId)
  updateChat: async (singleMassage, userId, sender, admin, time, date) => {
    try {
      const message = {
        sender: sender,
        message: singleMassage,
        time: time,
        date: date,
      };

      chatsSchema
        .findOne({ user: userId })
        .then((users) => {
          if (users) {
            if (users.admin) {
              users.admin = admin;
            }
            users.chat.push(message);

            users.save().then(console.log("saved!"));
          } else if (userId) {
            const chat = new chatsSchema({
              user: userId,
              admin: admin,
              chat: message,
            });
            chat?.save().then();
          }

          console.log("this is sender By BackEnd: ", message);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  },
  ML: (value, new_chat) => {
    try {
      let len, chat_from_db, i, a;
      let array = [];

      // find all chats that have the same message.
      return chatsSchema.find({ message: value }).then((chats) => {
        for (i = 0; i < chats.length; i++) {
          console.log(i);
          chat_from_db = chats[i]?.chat;
          len = new_chat.length - 1;
          let jib = [];
          if (value === new_chat[len.message]) {
            console.log("indeed");
          }
          //return the location of the message in the chat from the DB
          for (a = 0; a < chat_from_db.length; a++) {
            if (chat_from_db[a].message === value) {
              //jib needs to be an array, so he would know all the times that the message referenced in the chat
              jib.push(a);
              // console.log("worked!");
            }
          }

          //run all JIB values (all the matches for this chat)
          for (let j = 0; j < jib.length; j++) {
            let matchingLocation = jib[j];
            let mySmallArr = [];
            mySmallArr.push(chats[i]?.user);
            mySmallArr.push(matchingLocation);
            //checking how far the matches match, and insert into array
            while (
              chat_from_db[matchingLocation]?.message == new_chat[len]?.message
            ) {
              if (chat_from_db !== new_chat) {
                console.log(
                  chat_from_db[matchingLocation - 1]?.message,
                  " and ",
                  new_chat[len - 1]?.message
                );
                // if (matchingLocation !== len) {
                mySmallArr.push(new_chat[len].message);
                console.log("array push");
                if (matchingLocation === 0) {
                  break;
                }
                matchingLocation = matchingLocation - 1;
                len = len - 1;
                console.log(matchingLocation);
                // }
              }
            }
            if (mySmallArr.length > 0) array.push(mySmallArr);
          }
          //get the prediction items from DB
          // insert into jib[here] the one with the most values.
        }
        // only when user send the message

        console.log("that's the result", array);
        let bigger = 0;
        let store = 0;
        array.map((th, index) => {
          if (bigger < th.length) {
            store = index;
            bigger = array[index].length;
          }
        });

        console.log("this is bigger ", array[store]);
        return array[store];
      });
    } catch (err) {
      console.log(err);
    }
  },
};

//the meat! well the recursion start to look at the older messages and return all the messages that she matched.
// note, it is possible that await will cause problem

// function Recursion(chat_from_db, new_chat) {
//   if (chat_from_db[jib]?.message === new_chat[len]?.message) {
//     array.push(new_chat);
//     console.log("heyyyyyyy working");
//     jib = jib - 1;
//     len = len - 1;
//     return Recursion(chat_from_db, new_chat);
//   } else {
//     return (Obj.arr = array);
//   }
//
//   //will return the opp
// }
// Recursion(chat_from_db, new_chat);
