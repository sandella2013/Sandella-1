import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Sales = db.define("sales", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  customer: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  customerId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },

  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

db.sync();

export default Sales;
