const orderService = require('./order.service.js')
const gigService = require('../gig/gig.service')
const logger = require('../../services/logger.service')

async function getOrders(req, res) {
  try {
    logger.debug('Getting Orders')//to update, same as front
    const filterBy = {
      seller: req.query.seller || null,
      buyer: req.query.buyer || null,
    }
    const orders = await orderService.query(filterBy)
    res.json(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

async function getOrderById(req, res) {
  try {
    const orderId = req.params.id
    const order = await orderService.getById(orderId)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

async function addOrder(req, res) {
  const { loggedinUser } = req
  const gigId = req.params.id

  try {
    const order = await _createOrder(gigId, loggedinUser)
    const addedOrder = await orderService.add(order)
    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}


async function updateOrder(req, res) {
  try {
    const order = req.body
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })

  }
}

async function _createOrder(gigId, buyer) {
  try {
    const gig = await gigService.getById(gigId)
    return {
      buyer: {
        _id: buyer._id,
        fullname: buyer.fullname,
        imgUrl: buyer.imgUrl
      },
      seller: {
        _id: gig.owner._id,
        fullname: gig.owner.fullname,
        imgUrl: gig.owner.imgUrl
      },
      gig: {
        _id: gig._id,
        name: gig.description,
        price: gig.price,
        imgUrl: gig.imgUrl[0] || 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
      },
      status: "pending"
    }
  }
  catch (err) {
    console.log('not working')
  }
}

async function removeOrder(req, res) {
  try {
    const orderId = req.params.id
    const removedId = await orderService.remove(orderId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}

async function addOrderMsg(req, res) {//change to review from msg
  const { loggedinUser } = req
  try {
    const orderId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await orderService.addOrderMsg(orderId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })

  }
}

async function removeOrderMsg(req, res) {//to change to review
  const { loggedinUser } = req
  try {
    const orderId = req.params.id
    const { msgId } = req.params

    const removedId = await orderService.removeOrderMsg(orderId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order msg', err)
    res.status(500).send({ err: 'Failed to remove order msg' })

  }
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
  addOrderMsg,
  removeOrderMsg
}
