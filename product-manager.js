// ----- Creo la clase -----
class ProductManager {
  constructor() {
    this.myArray = [];
    this.productIdCounter = 1;
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

    let isInMyArray = this.myArray.some((el) => el.code == product.code);
    if (isInMyArray) {
      console.log("El código " + product.code + " ya existe en ProductManager");
    } else {
      this.myArray.push(product);
      console.log("Producto agregado correctamente.");
      this.productIdCounter++;
    }
  }
  getProducts() {
    console.log(this.myArray);
  }

  getProductById(id) {
    if (this.myArray.some((el) => el.id == id)) {
      let productFound = this.myArray.filter((el) => el.id == id);
      console.log("El producto solicitado es " + productFound[0].title);
    } else {
      console.log("Not found");
    }
  }
}

// ----- Instancio la clase -----
let myProducts = new ProductManager();
myProducts.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Image",
  "abc123",
  25
);
myProducts.getProducts();

myProducts.getProductById(3);
