import fs from "fs";

// ----- Creo la clase -----
export class CartManager {
  constructor(path) {
    if (!path || typeof path !== "string") {
      throw new Error(
        "Se debe proporcionar un path válido al crear la instancia de ProductManager."
      );
    } else {
      this.myArray = [];
      this.path = path;
    }
  }
  // ----- Método agregar carritos-----
  addCart() {
    let file = fs.readFileSync(this.path, "utf-8");
    let carts = JSON.parse(file);
    let productIdCounter = carts.length === 0 ? 1 : carts.length + 1;

    let newCart = {
      id: productIdCounter,
      products: [],
    };

    carts.push(newCart);
    fs.writeFileSync(this.path, JSON.stringify(carts));
    return newCart;
  }

  getCartById(id) {
    if (!fs.existsSync(this.path)) return "Error: el archivo no existe";
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    if (this.myArray.some((el) => el.id == id)) {
      let cartFound = this.myArray.filter((el) => el.id == id);
      return cartFound;
    } else {
      return "Cart id does not exixsts";
    }
  }
  addProductsToCart(cid, pid) {
    let file = fs.readFileSync(this.path, "utf-8");
    this.myArray = JSON.parse(file);
    const cartIndex = this.myArray.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return "Cart does not exist";
    }

    const cart = this.myArray[cartIndex];
    const productIndex = cart.products.findIndex(
      (product) => product.id === pid
    );

    if (productIndex === -1) {
      cart.products.push({ id: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }
    fs.writeFileSync(this.path, JSON.stringify(this.myArray));
    return cart;
  }
}
