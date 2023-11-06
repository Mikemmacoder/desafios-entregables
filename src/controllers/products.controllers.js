import productsModel from "../dao/models/products.model.js";
import { PORT } from "../app.js";

//-----controllers de api/products-----
export const getProducts = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const paginateOptions = { lean: true, limit, page };
  
      const filterOptions = {};
      if (req.query.stock) filterOptions.stock = req.query.stock;
      if (req.query.category) filterOptions.category = req.query.category;
      if (req.query.sort === "asc") paginateOptions.sort = { price: 1 };
      if (req.query.sort === "desc") paginateOptions.sort = { price: -1 };
      const result = await productsModel.paginate(filterOptions, paginateOptions);
  
      let prevLink;
      if (!req.query.page) {
        prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${result.prevPage}`
        );
        prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      let nextLink;
      if (!req.query.page) {
        nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${result.nextPage}`
        );
        nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      if (page > result.totalPages) {
        return {
          statusCode: 404,
          response: { status: "error", error: "not found" },
        }
      }
      return {
        statusCode: 200,
        response: {
          status: "success",
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage ? prevLink : null,
          nextLink: result.hasNextPage ? nextLink : null,
          totalPages0: result.totalPages == 0 && true,
        },
      };
    } catch (err) {
      return {
        statusCode: 500,
        response: { status: "error", error: err.message },
      };
    }
  };
export const getProductsController = async (req, res) => {
    const result = await getProducts(req, res);
    res.status(result.statusCode).json(result.response)
}
export const getProductByIdController = async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await productsModel.findById(id).lean().exec();
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
        const result = await productsModel.create(product);
        const products = await productsModel.find().lean().exec();
        res.status(201).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const modifyProductByIdController =async (req, res) => {
    try {
        const id = req.params.pid;
        const data = req.body;
        const result = await productsModel.findByIdAndUpdate(id, data, {
          returnDocument: "after",
        });
        if (result === null) {
          return res.status(404).json({ status: "error", error: "Not found" });
        }
        const products = await productsModel.find().lean().exec();
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteProductByIdController =async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await productsModel.findByIdAndDelete(id);
        if (result === null) {
          return res.status(404).json({ status: "error", error: "Not found" });
        }
        const products = await productsModel.find().lean().exec();
        res.status(200).json({ status: "success", payload: products });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}

//-----controllers de /products----- en view.router
export const realTimeProductsController =async (req, res) => {
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
}
export const homeProductsController =async (req, res) => {
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
