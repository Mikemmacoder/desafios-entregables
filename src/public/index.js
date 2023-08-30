const socketClient = io();
let chatBox = document.getElementById("chatBox");

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socketClient.emit("message", chatBox.value);
  }
});

socketClient.on("history", (data) => {
  let history = document.getElementById("history");
  let messages = "";
  data.forEach((message) => {
    // messages += `${message}<br>`
    messages += `${message.userId} dice: ${message.message}<br>`;
  });
  history.innerHTML = messages;
  chatBox.value = "";
});
