Swal.fire({
  title: "Authentication",
  input: "text",
  text: "Set a username for the chat",
  inputValidator: (value) => {
    return !value.trim() && "Please, write a valid username";
  },
  allowOutsideClick: false,
}).then((result) => {
  let user = result.value;
  document.getElementById("username").innerHTML = user;
  let socketClient = io();

  let chatBox = document.getElementById("chatbox");
  chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
        socketClient.emit("message", {
          user,
          message: chatBox.value,
        });
        chatBox.value = "";
      }
    }
  });

  socketClient.on("logs", (data) => {
    const divLogs = document.getElementById("log");
    let messages = "";
    data.reverse().forEach((message) => {
      messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
    });
    divLogs.innerHTML = messages;
  });
});
