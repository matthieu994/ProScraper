require("dotenv").config()
const path = require("path")
const bodyParser = require("body-parser")

var mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).catch(err => console.error(err.name))

const start = require("./start")
const app = start()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const itemRoutes = require("./routes/itemRoutes")
app.use("/api", itemRoutes)

app.get("*", function(req, res) {
    res.sendFile(path.resolve(__dirname, "../react-ui/build", "index.html"))
})

require("./scrape")()
