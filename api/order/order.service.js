const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { buyer: null, seller: null }) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).toArray()
        // console.log('back',orders);
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: new ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: new ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const {_id} = order
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: order })
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function addOrderMsg(orderId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: new ObjectId(orderId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}

async function removeOrderMsg(orderId, msgId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: new ObjectId(orderId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    // if (filterBy.title) {
    //     criteria.$or = [
    //         { title: { $regex: new RegExp(filterBy.title, 'i') } },
    //     ]
    // }

    // if (filterBy.tag) {
    //     criteria.tags = { $in: [filterBy.tag] }
    // }

    // if (filterBy.budget) {
    //     criteria.price = {
    //         $gte: filterBy.budget.min,
    //         $lte: filterBy.budget.max
    //     }
    // }

    // if (filterBy.daysToMake) {
    //     criteria.daysToMake = { $lte: filterBy.daysToMake }
    // }

    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addOrderMsg,
    removeOrderMsg
}
