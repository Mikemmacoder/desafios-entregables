import fs from "fs";
import logger from "../../utils/logger";

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
      /* !thumbnails || */
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
    let productIdCounter =
      products.length === 0 ? 1 : products[products.length - 1].id + 1;

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
    logger.info("Código del nuevo producto:", newProduct.code);
    const exists = products.some((product) => product.code === newProduct.code);
    logger.info("exists" + exists);
    if (exists) {
      return "El código " + newProduct.code + " ya existe en ProductManager";
    } else {
      products.push(newProduct);
      fs.writeFileSync(this.path, JSON.stringify(products));
      logger.info("se escribió");
      return newProduct;
    }
  }
  getProducts() {
    if (!fs.existsSync(this.path)) {
      logger.warning("El archivo no existe");
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
      return `No se encontró ningún producto con el id ${id}`;
    } else {
      const newArray = this.myArray.filter((el) => el.id !== id);
      this.myArray = newArray;
      fs.writeFileSync(this.path, JSON.stringify(newArray));
      logger.info(`El elemento de id ${id} ha sido eliminado`);
      return this.myArray;
    }
  }
  // ----- Métodos de escribir y leer archivos-----
  escribirArchivo() {
    fs.writeFileSync(this.path, JSON.stringify(this.myArray));
  }
}
