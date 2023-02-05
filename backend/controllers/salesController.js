import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import ProBatch from "../models/productBatchModel.js";
import Product from "../models/productsModel.js";
import db from "../config/db.js";
import Sales from "../models/salesModel.js";
import SaleItems from "../models/salesItemModel.js";
import Customer from "../models/customerModel.js";
import sendEmail from "../Utils/email.js";

// @desc create a Sale
// @route POST / api/sales
// @access Private
const createSale = asyncHandler(async (req, res) => {
  console.log(req.body)
  const customerArr = req.body.customer.split(" ");
  const customer = await Customer.findByPk(customerArr[customerArr.length - 1]);
  if (!customer) {
    res.status(500);
    throw new Error("Invalid Customer Data");
  }

  if (req.body.SalesItems) {
    for (let i = 0; i < req.body.SalesItems.length; i++) {
      const batch = await ProBatch.findByPk(req.body.SalesItems[i].id);
      if (batch.qty < req.body.SalesItems[i].qty) {
        res.status(500);
        throw new Error("Please Reset Your cart and try again");
      }
    }
  }

  if (!req.body.customer) {
    res.status(400);
    throw new Error("Please add Customer");
  }

  const sale = {
    id: uuidv4(),
    customer: req.body.customer,
    userName: req.user.name,
    userId: req.user.id,
    total: req.body.cartTotal,
    discount: req.body.discount,
    customer: customer.name,
    customerId: customer.id,
    subTotal: Number(req.body.cartTotal) - (Number(req.body.cartTotal)*(req.body.discount/100)),
  };

  if (req.body.SalesItems) {
    const saleResult = await Sales.create(sale);
    if (saleResult) {
      for (let i = 0; i < req.body.SalesItems.length; i++) {
        const batch = await ProBatch.findByPk(req.body.SalesItems[i].id);

        batch.set({
          qty: Number(batch.qty) - Number(req.body.SalesItems[i].qty),
        });


        await batch.save();

        const salesItem = {
          id: uuidv4(),
          saleId: saleResult.id,
          productId: req.body.SalesItems[i].productId,
          productName: req.body.SalesItems[i].product.name,
          quantity: req.body.SalesItems[i].qty,
          costPrice: req.body.SalesItems[i].costPrice,
          price: req.body.SalesItems[i].salesPrice,
        };

        await SaleItems.create(salesItem);
      }
    }

    if (customer.email) {
      await sendEmail(req.body.customer, saleResult.id);
    }

    res.status(201).json(saleResult);
  } else {
    res.status(500);
    throw new Error("Something went Wrong");
  }
});

// @desc  list all Sales
// @route GET /api/sales
// @access Private
const listSales = asyncHandler(async (req, res) => {
  //
  const sales = await Sales.findAll();
  res.status(200).json(sales);
});

// @desc  get Invoice
// @route GET /api/sales/invoice
// @access Private
const invoiceData = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const sale = await Sales.findByPk(req.params.id);
  console.log(sale.id)
  const salesItems = await SaleItems.findAll({
    where: {
      saleId: sale.id,
    },
  });
  const customer = await Customer.findByPk(sale.customerId);


  res.status(200).json({ sale, salesItems, customer });
});

// @desc  list latest 10 sales
// @route GET /api/latest
// @access Private
const latestSales = asyncHandler(async (req, res) => {
  const sales = await Sales.findAll({
    limit: 10,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(sales);
});

// @desc  list all Sales by item
// @route GET /api/sales/items
// @access Private
const listSalesbyItem = asyncHandler(async (req, res) => {
  const sales = await SaleItems.findAll();
  res.status(200).json(sales);
});

// @desc  total of sales
// @route GET /api/sales/total
// @access Private
const totalSales = asyncHandler(async (req, res) => {
  const sales = await db.query(`SELECT SUM(subTotal) as totalSales
  FROM sales`);
  res.status(200).json(sales[0][0]);
});

export {
  createSale,
  listSales,
  listSalesbyItem,
  latestSales,
  totalSales,
  invoiceData,
};
