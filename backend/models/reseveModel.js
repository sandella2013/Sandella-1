import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Reserve = db.define('Reserved', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },


  batchId: {
    type: DataTypes.UUID,
    references: {
      model: 'ProBatches', // name of the referenced model
      key: 'id', // name of the foreign key column in the Profile model
    },
  },
  
  productId: {
    type: DataTypes.UUID,
    references: {
      model: 'products', // name of the referenced model
      key: 'id', // name of the foreign key column in the Profile model
    },
  },

  customerId: {
    type: DataTypes.UUID,
    references: {
      model: 'customers', // name of the referenced model
      key: 'id', // name of the foreign key column in the Profile model
    },
  },
})

db.sync()

export default Reserve