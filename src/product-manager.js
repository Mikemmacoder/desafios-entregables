import fs from "fs";

// ----- Creo la clase -----
export class ProductManager {
  constructor(path) {
    if (!path || typeof path !== "string") {
      throw new Error(
        "Se debe proporcionar un path válido al crear la instancia de ProductManager."
      );
    } else {
      this.myArray = [];
      this.productIdCounter = 1;
      this.path = path;
    }
  }
  // ----- Método agregar productos-----
  addProduct(product) {
    const {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    } = product;
    if (
      !title ||
      !description ||
      isNaN(price) ||
      //  !thumbnail ||
      !code ||
      isNaN(stock) ||
      !status ||
      !category
    ) {
      return "Error: Todas las propiedades del producto son obligatorias.";
    }
    if (price < 0 || stock < 0) {
      return "Error: Precio y stock no pueden ser números negativos.";
    }

    let file = fs.readFileSync(this.path, "utf-8");
    let products = JSON.parse(file);
    let productIdCounter = products.length === 0 ? 1 : products.length + 1;

    let newProduct = {
      id: productIdCounter,
      title,
      description,
      price: Number(price),
      thumbnails,
      code,
      stock: Number(stock),
      status: Boolean(status),
      category,
    };

    const found = products.find((el) => el.code === newProduct.code);
    if (found) {
      return "El código " + newProduct.code + " ya existe en ProductManager";
    } else {
      products.push(newProduct);
      fs.writeFileSync(this.path, JSON.stringify(products));
      return newProduct;
    }
  }
  getProducts() {
    if (!fs.existsSync(this.path)) {
      console.log("El archivo no existe");
      return [];
    }

    let file = fs.readFileSync(this.path, "utf-8");
    const products = JSON.parse(file);
    return products;
  }

  getProductById(id) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    if (this.myArray.some((el) => el.id == id)) {
      let productFound = this.myArray.filter((el) => el.id == id);
      return productFound;
    } else {
      return "Product id does not exixsts";
    }
  }

  updateProductById(id, update) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);

    let productToUpdate = this.myArray.find((el) => el.id === id);

    if (!productToUpdate) {
      return `No se encontró ningún producto con el id ${id}`;
    }

    Object.assign(productToUpdate, update);

    fs.writeFileSync(this.path, JSON.stringify(this.myArray));

    return productToUpdate;
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
      return this.myArray;
    }
  }
  // ----- Métodos de escribir y leer archivos-----
  escribirArchivo() {
    fs.writeFileSync(this.path, JSON.stringify(this.myArray));
  }
}

// ----- Instancio la clase -----
/*let myProducts = new ProductManager("./ej-path.js");

console.log(myProducts.getProducts());
myProducts.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
myProducts.addProduct({
  title: "producto2",
  description: "Este es un producto2",
  price: 500,
  thumbnail: "Sin imagen",
  code: "abc1241",
  stock: 214,
});
console.log(myProducts.getProducts());

console.log(myProducts.getProductById(1));
console.log(myProducts.getProductById(2));

myProducts.updateProductById(1, { price: 250 });
myProducts.updateProductById(2, { price: 750 });
console.log(myProducts.getProducts());

myProducts.deleteProductById(1);
console.log(myProducts.getProducts());
 */
