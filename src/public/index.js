const socket = io();
const table = document.getElementById("realProductsTable");
document.getElementById("createBtn").addEventListener("click", () => {
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };
  fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "aplication/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
    })
    .then(() => fetch("/api/products"))
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      socketClient.emit("productList", result.payload);
      alert("El producto se ha agregado con éxito");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
    })
    .catch((err) => alert(`Ocurrió un error: ${err}`));
});

deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      socket.emit("productList", result.payload);
      alert("El producto ha sido eliminado");
    })
    .catch((err) => alert(`Ocurrió un error: ${err}`));
};

socket.on("updatedProducts", (data) => {
  table.innerHTML = `<tr>
        <td></td>
        <td>Nombre</td>
        <td>Descripción</td>
        <td>Precio</td>
        <td>Stock</td>
        <td>Código</td>
        <td>Categoría</td>
      </tr>`;
  for (product of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
          <td><button
              onclick="deleteProduct({{this.id}})"
            >Eliminar</button></td>
          <td>{{this.title}}</td>
          <td>{{this.description}}</td>
          <td>{{this.price}}</td>
          <td>{{this.stock}}</td>
          <td>{{this.code}}</td>
          <td>{{this.category}}</td>
          `;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});

///////////////////////////////////////////7

/* 
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
 */
