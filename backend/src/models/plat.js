import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Plat = sequelize.define('Plat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  prix: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  categorie: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'plats',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Plat;