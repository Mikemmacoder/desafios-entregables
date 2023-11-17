const socket = io()
let socketClient = io();
  
let chatBox = document.getElementById("chatbox");
chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
          socketClient.emit("message", {
            user: document.getElementById('username').innerText,
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

socket.on('alerta', () => {
    alert('Un nuevo usuario se ha conectado...')
})