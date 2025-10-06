const User = require('./User');
const Product = require('./productModel');
const Order = require('./Order');
const OrderItem = require('./orderItem');
const Admin = require('./Admin');

// Relationships
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { User, Product, Order, OrderItem, Admin };