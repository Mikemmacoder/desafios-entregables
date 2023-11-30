import { PORT } from "../app.js";
import { ProductService } from "../services/index.js";
import EErros from "../services/errors/enums.js";
import CustomError from "../services/errors/custom.errors.js";
import { generateErrorInfo } from "../services/errors/info.js";

//-----controllers de api/products-----

export const getProductsController = async (req, res) => {
    const result = await ProductService.getAllPaginate(req)
    res.status(result.statusCode).json(result.response)
}
export const getProductController = async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await ProductService.getById(id);
        if (result === null) {
          return res.status(404).json({ status: "error", error: "Not found" });
        }
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const createProductController =async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.status || !product.category ) {
          CustomError.createError({
              name: "User creation error",
              cause: generateErrorInfo(product),
              message: "Product creation error" + generateErrorInfo(product),
              code: EErros.INVALID_TYPES_ERROR
          })
        }
        const result = await ProductService.create(product);
        const products = await ProductService.getAll();
        res.status(201).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const modifyProductByIdController =async (req, res) => {
    try {
        const id = req.params.pid;
        const data = req.body;
        /* const result = await productsModel.findByIdAndUpdate(id, data, {
          returnDocument: "after",
        }); */
        const result = await ProductService.update(id, data, { new: true});
        if (result === null) {
          return res.status(404).json({ status: "error", error: "Not found" });
        }
        const products = await ProductService.getAll(); // Esto es necesario?
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteProductByIdController =async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await ProductService.delete(id);
        if (result === null) {
          return res.status(404).json({ status: "error", error: "Not found" });
        }
        const products = await ProductService.getAll();
        res.status(200).json({ status: "success", payload: products });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}

//-----controllers de /products----- en view.router
export const realTimeProductsController =async (req, res) => {
    const result = await ProductService.getAllPaginate(req, { new: true});
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
}
export const homeProductsController = async (req, res) => {
    const result = await ProductService.getAllPaginate(req);
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
    const user = req.user.user;
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
}
