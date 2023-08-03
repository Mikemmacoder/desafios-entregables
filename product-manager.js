const fs = require("fs");

// ----- Creo la clase -----
class ProductManager {
  constructor(path) {
    if (!path || typeof path !== "string") {
      throw new Error(
        "Se debe proporcionar un path válido al crear la instancia de ProductManager."
      );
    } else {
      this.myArray = [];
      this.productIdCounter = 1;
      this.path = path;
      fs.writeFileSync(this.path, JSON.stringify(this.myArray));
    }
  }
  // ----- Método agregar productos-----
  addProduct(title, description, price, thumbnail, code, stock) {
    if (
      !title ||
      !description ||
      isNaN(price) ||
      !thumbnail ||
      !code ||
      isNaN(stock)
    ) {
      console.log(
        "Error: Todas las propiedades del producto son obligatorias."
      );
      return;
    }

    let product = {
      id: this.productIdCounter,
      title,
      description,
      price: Number(price), // Asegurarse de que el precio sea un número
      thumbnail,
      code,
      stock: Number(stock), // Asegurarse de que el stock sea un número
    };

    let file = fs.readFileSync(this.path, "utf-8");
    let products = JSON.parse(file);
    const found = products.find((el) => el.code === product.code);
    if (found) {
      console.log("El código " + product.code + " ya existe en ProductManager");
    } else {
      this.myArray.push(product);
      console.log("Producto agregado correctamente.");
      this.productIdCounter++;
      fs.writeFileSync(this.path, JSON.stringify(this.myArray));
    }
  }
  getProducts() {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    console.log(JSON.parse(file));
  }

  getProductById(id) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    if (this.myArray.some((el) => el.id == id)) {
      let productFound = this.myArray.filter((el) => el.id == id);
      console.log(`El producto de id ${id} es ` + productFound[0].title);
    } else {
      console.log("Not found");
    }
  }

  updateProductById(id, update) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    let newProducts = this.myArray.map((el) => {
      if (el.id !== id) {
        return `Error: el producto de id ${id} no existe`;
      } else {
        return { ...el, ...update };
      }
    });
    fs.writeFileSync(this.path, JSON.stringify(newProducts));
    console.log(`El producto con id ${id} sa sido actualizado correctamente.`);
  }

  deleteProductById(id) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    const productToDelete = this.myArray.find((el) => el.id === id);
    if (!productToDelete) {
      console.log(`No se encontró ningún producto con el id ${id}`);
      return;
    } else {
      const newArray = this.myArray.filter((el) => el.id !== id);
      this.myArray = newArray;
      fs.writeFileSync(this.path, JSON.stringify(newArray));
      console.log(`El elemento de id ${id} ha sido eliminado`);
    }
  }
}

// ----- Instancio la clase -----
let myProducts = new ProductManager("./ej-path.js");

myProducts.getProducts();

myProducts.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Image",
  "abc123",
  25
);
myProducts.getProducts();

myProducts.addProduct(
  "producto fail1",
  "Este es un producto prueba que le falta un campo",
  600,
  "Sin Image",
  "abc123"
);

myProducts.addProduct(
  "producto fail2",
  "Este es un producto fail2 por código repetido",
  600,
  "Sin Image",
  "abc123",
  13
);

myProducts.getProducts();

myProducts.getProductById(1);
myProducts.getProductById(2);

myProducts.updateProductById(1, { price: 250 });
myProducts.getProducts();

myProducts.deleteProductById(1);
myProducts.getProducts();
myProducts.deleteProductById(2);
