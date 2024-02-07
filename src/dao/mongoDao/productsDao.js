 import productsModel from "./models/products.model.js";
import { PORT } from "../../app.js";

export default class ProductMongoDAO {
    getAll = async() => await productsModel.find().lean().exec()
    getById = async(id) => await productsModel.findById(id).lean().exec();
    getAllPaginate = async(req, options) => {
      try {
        //const limit = parseInt(req.query.limit) || 10;
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;

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
          nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}${req.originalUrl.includes('?') ? '&' : '?'}page=${result.nextPage}`;
        } else {
          const modifiedUrl = req.originalUrl.replace(
            `page=${req.query.page}`,
            `page=${result.nextPage}`
          );
          nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
        }
        const totalPages = [];
        let link;
        for (let index = 1; index <= result.totalPages; index++) {
          if (!req.query.page) {
            link = `http://${req.hostname}:${PORT}${req.originalUrl}${req.originalUrl.includes('?') ? '&' : '?'}page=${index}`;
          } else {
            const modifiedUrl = req.originalUrl.replace(
              `page=${req.query.page}`,
              `page=${index}`
            );
            link = `http://${req.hostname}:${PORT}${modifiedUrl}`;
          }
          totalPages.push({ page: index, link });
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
            totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? prevLink : null,
            nextLink: result.hasNextPage ? nextLink : null,
            //totalPages0: result.totalPages == 0 && true,
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