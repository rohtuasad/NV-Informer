const axios = require("axios");
const connection = require("../mySql/connection");

var sendMessage = function(chatId, message) {
  var url = ``;
  console.log(url);
  axios
    .get(url)
    .then(response => {
      console.log(response.data.url);
      console.log(response.data.explanation);
    })
    .catch(error => {
      console.log(error);
    });
};

exports.sendMessage = sendMessage;

exports.sendGroupMessage = function(num, message, callback) {
  console.log(message);
  connection.getGroupIds(+num + 1, function(rows) {
    for (var i = 0; i < rows.length; i++) {
      sendMessage(rows[i].tlgid, message);
    }
  });
  callback({ success: true });
};
