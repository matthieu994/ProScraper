const mongoose = require("mongoose")
const ItemSchema = require("../models/itemModel")

const Item = mongoose.model("Item", ItemSchema)

module.exports = {
    add(req, res) {
        let newItem = new Item(req.body)

        newItem.save((err, Item) => {
            if (err) {
                res.send(err)
            }
            res.json(Item)
        })
    },

    getAll(req, res) {
        Item.find({}, (err, item) => {
            if (err) {
                res.send(err)
            }
            res.json(item)
        })
    },

    get(req, res) {
        Item.findById(req.params.itemId, (err, item) => {
            if (err) {
                res.send(err)
            }
            res.json(item)
        })
    },

    edit(req, res) {
        Item.findOneAndUpdate(
            { _id: req.params.itemId },
            req.body,
            { new: true, useFindAndModify: false },
            (err, item) => {
                if (err) {
                    res.send(err)
                }
                res.json(item)
            }
        )
    },

    delete(req, res) {
        Item.findOneAndRemove(req.params.itemId, (err, item) => {
            if (err) {
                res.send(err)
            }
            res.json({ message: "Successfully deleted item!", item })
        })
    }
}
