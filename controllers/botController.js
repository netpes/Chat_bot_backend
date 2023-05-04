const bot_schema = require("../schema/botSchema");

module.exports = {
  //admin approve
  SearchForAnswer: (question) => {
    return bot_schema
      .findOne({ question: question })
      .then((questionValues) => {
        if (questionValues?.answer) {
          //calc the most common answer
          const arr1 = questionValues.answer;
          let mf = 1;
          let m = 0;
          let item;
          for (let i = 0; i < arr1.length; i++) {
            for (let j = i; j < arr1.length; j++) {
              if (arr1[i] == arr1[j]) m++;
              if (mf < m) {
                mf = m;
                item = arr1[i];
              }
            }
            m = 0;
          }
          console.log(`${item} ( ${mf} times ) `);
          return questionValues.answer[0];
        } else {
          console.log(false);
          return false;
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  },
  CreateAnswer: (question, answer, admin) => {
    return (
      bot_schema
        .findOne({ question: question })
        //if question exist...
        .then((questionValues) => {
          console.log(questionValues);
          if (questionValues) {
            //later insert here and answer into array of answers
            questionValues.answer.push(answer);
          } else {
            const bot = new bot_schema({
              question: question,
              admin: admin,
              answer: answer,
            });
            bot?.save().then();
          }
        })
        .catch((err) => {
          console.log(err);
        })
    );
  },
};
