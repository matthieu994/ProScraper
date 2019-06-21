const express = require("express")
const ItemController = require("../controllers/itemController")
const api = express.Router()

api.route("/scrape/items")
    .get(ItemController.getAll)
    .post(ItemController.add)

api.route("/scrape/items/:itemId")
    .get(ItemController.get)
    .put(ItemController.edit)
    .delete(ItemController.delete)

// Handle all other requests on /api
api.use("*", function(req, res) {
    res.status(501).send({ message: `⚠️ Error ! You are on ${req.originalUrl}` })
})

module.exports = api
