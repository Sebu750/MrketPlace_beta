const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { buildPaginated, paginate } = require("../middleware/pagination");
const { emitToDesigner, emitToCustomer, sendNotification } = require("../config/socket");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { items, shipping } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error("Order items are required"); }

  let subtotal = 0;
  const designerItems = {}; // group by designer

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product ${item.product} not found`); }
    if (product.status !== "active") { res.status(400); throw new Error(`${product.name} is not available`); }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    if (!designerItems[product.designer]) designerItems[product.designer] = [];
    designerItems[product.designer].push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: `PKR ${product.price.toLocaleString("en-PK")}`,
      priceRaw: product.price,
    });
  }

  const commissionRate = 0.1;
  const commission = Math.round(subtotal * commissionRate);
  const shippingCost = 0;
  const netPayout = subtotal - commission - shippingCost;

  // Create orders per designer (one order per designer)
  const orders = [];
  for (const [designerId, designerItemList] of Object.entries(designerItems)) {
    const orderSubtotal = designerItemList.reduce((sum, i) => sum + i.priceRaw * i.quantity, 0);
    const order = await Order.create({
      customer: req.user._id,
      designer: designerId,
      items: designerItemList,
      shipping,
      financial: {
        subtotal: orderSubtotal,
        commission: Math.round(orderSubtotal * commissionRate),
        commissionRate,
        shipping: shippingCost,
        netPayout: orderSubtotal - Math.round(orderSubtotal * commissionRate) - shippingCost,
      },
      timeline: [{ status: "new", timestamp: new Date() }],
    });
    orders.push(order);

    // Socket.io: notify designer
    emitToDesigner(designerId, "order:created", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.financial.subtotal,
    });
    sendNotification(designerId, {
      type: "new_order",
      message: `New order ${order.orderNumber} received`,
    });
  }

  res.status(201).json({ success: true, data: orders });
});

exports.getMyOrders = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const { data, pagination } = await buildPaginated(Order, { customer: req.user._id }, req, {
      populate: "designer",
      sort: "-createdAt",
    });
    res.json({ success: true, data, pagination });
  }),
];

exports.getDesignerOrders = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const designer = req.designer || req.user;
    const query = { designer: designer._id };
    if (req.query.status && req.query.status !== "all") query.status = req.query.status;
    if (req.query.search) query.orderNumber = { $regex: req.query.search, $options: "i" };

    const { data, pagination } = await buildPaginated(Order, query, req, {
      populate: "customer",
      sort: "-createdAt",
    });
    res.json({ success: true, data, pagination });
  }),
];

exports.getOrderDetail = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("customer designer");
  if (!order) { res.status(404); throw new Error("Order not found"); }

  const isOwner = order.customer._id.toString() === req.user._id.toString() ||
                  order.designer._id.toString() === req.user._id.toString() ||
                  req.user.role === "admin";
  if (!isOwner) { res.status(403); throw new Error("Not authorized"); }

  res.json({ success: true, data: order });
});

exports.advanceStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.designer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }

  const statusFlow = ["new", "in_production", "ready_to_ship", "shipped", "delivered"];
  const currentIdx = statusFlow.indexOf(order.status);
  if (currentIdx === -1 || currentIdx >= statusFlow.length - 1) { res.status(400); throw new Error("Invalid status transition"); }

  order.status = statusFlow[currentIdx + 1];
  await order.save();

  emitToCustomer(order.customer.toString(), "order:statusChanged", {
    orderId: order._id,
    orderNumber: order.orderNumber,
    newStatus: order.status,
  });

  res.json({ success: true, data: order });
});

exports.addTracking = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.designer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }

  const { carrier, number, url } = req.body;
  order.tracking = { carrier, number, url, shippedAt: new Date() };
  await order.save();

  emitToCustomer(order.customer.toString(), "order:trackingAdded", {
    orderId: order._id,
    orderNumber: order.orderNumber,
    tracking: number,
  });

  res.json({ success: true, data: order });
});
