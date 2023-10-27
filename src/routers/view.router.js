import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import { PORT } from "../app.js";
import { getProductsFromCart } from "./carts.router.js";
import { getProducts } from "./products.router.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", publicRoutes, async (req, res) => {
  const result = await getProducts(req, res);
  if (result.statusCode === 200) {
    const totalPages = [];
    let link;
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    const user = req.session.user;
    res.render("home", {
      user,
      products: result.response.payload,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages,
      },
    });
  } else {
    const showErrorAlert = true; 
    const errorMessage = result.response.error 
    res
      .status(result.statusCode)
      .render("home", { showErrorAlert, errorMessage })
      //renderiza sweet alert
      //TODO: ahora el home renderiza productos, debería haber una pagina de bienvenida a la cual redireccionar
  }
});

router.get("/realTimeProducts", publicRoutes, async (req, res) => {
  //const products = await productManager.getProducts();
  const result = await getProducts(req, res);
  if (result.statusCode === 200) {
    res.render("realTimeProducts", { products: result.response.payload });
  } else {
    const showErrorAlert = true; 
    const errorMessage = result.response.error 
    res
      .status(result.statusCode)
      .render("home", { showErrorAlert, errorMessage })
      //renderiza sweet alert
      //TODO: ahora el home renderiza productos, debería haber una pagina de bienvenida a la cual redireccionar
  }
});

router.get("/:cid", publicRoutes, async (req, res) => {
  const result = await getProductsFromCart(req, res);
  if (result.statusCode === 200) {
    res.render("productsFromCart", {
      cart: result.response.payload,
    });
  } else {
    const showErrorAlert = true; 
    const errorMessage = result.response.error 
    res.status(result.statusCode)
    .render("home", { showErrorAlert, errorMessage })
      //renderiza sweet alert
      //TODO: ahora el home renderiza productos, debería haber una pagina de bienvenida a la cual redireccionar
  }
});

router.get("/create", async (req, res) => {
  res.render("create", {});
});

export default router;
