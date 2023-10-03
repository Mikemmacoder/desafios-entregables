import { Router } from "express";
const router = Router();
//import multer from "multer";

import productsModel from "../dao/models/products.model.js";
import { PORT } from "../app.js";
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); */

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

router.get("/", async (req, res) => {
  const result = await getProducts(req, res);
  res.status(result.statusCode).json(result.response);
});
router.get("/:pid", async (req, res) => {
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
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await productsModel.create(product);
    const products = await productsModel.find().lean().exec();
    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.put("/:pid", async (req, res) => {
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
});

router.delete("/:pid", async (req, res) => {
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
});

export default router;
