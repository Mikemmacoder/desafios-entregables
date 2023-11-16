 import productsModel from "./models/products.model.js";
import { PORT } from "../../app.js";
/*
export const getAllProducts = async () => {
    const products = await productsModel.find().lean().exec();
    return products
};
export const getProduct = async (id) => {
    const result = await productsModel.findById(id).lean().exec();
    return result
}
export const create = async (product) => {
    const result = await productsModel.create(product)
    return result
};
export const update = async (id, data) => {
    const result = await productsModel.findByIdAndUpdate(id, data)
    return result
};
export const deleteById = async (id) => {
    const result = await productsModel.findByIdAndDelete(id);
    return result
};
export const getAllPaginate = async (req) => {
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
} */
//TODO :REEMPLAZAR LAS FUNCIONES POR LA CLASE

export default class ProductMongoDAO {
    getAll = async() => await productsModel.find().lean().exec()
    getById = async(id) => await productsModel.findById(id).lean().exec();
    getAllPaginate = async(req, options) => {
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
    }
    create = async(product) => await productsModel.create(product)
    update = async(id, data, options) => await productsModel.findByIdAndUpdate(id, data, options)
    delete = async(id) => await productsModel.findByIdAndDelete(id);
}