const socket = io();
const table = document.getElementById("realProductsTable");
document.getElementById("createBtn").addEventListener("click", () => {
  event.preventDefault()
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").checked,
    code: document.getElementById("code").value,
  };
  fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
      socket.emit("productList", result.payload);
      alert("El producto se ha agregado con éxito");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
      document.getElementById("code").value = "";
    })
    .catch((err) => alert(`Ocurrió un error: ${err}`));
});

deleteProduct = (id) => {
  if (id === undefined) {
    alert("ID del producto no definido. No se puede eliminar.");
    return;
  }
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
deleteProdFromCart = (pid, cid) => {
  if (pid === undefined) {
    alert("ID del producto no definido. No se puede eliminar.");
    return;
  }
  fetch(`/api/carts/cid/products/pid`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
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
        <td>Status</td>
      </tr>`;
  for (product of data) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
          <td><button
              onclick="deleteProduct('${product._id}')"
            >Eliminar</button></td>
          <td>${product.title}</td>
          <td>${product.description}</td>
          <td>${product.price}</td>
          <td>${product.stock}</td>
          <td>${product.code}</td>
          <td>${product.category}</td>
          <td>${product.status}</td>
          `;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});