import express from "express"
const App = express()
import Users from "./routes/Users.js"
import Seller from './routes/Seller.js'
import cors from "cors"
import bodyparser from "body-parser"
const PORT = 1000
App.use(express.json())
App.use(express.static('public'))
App.use(bodyparser.json())
App.use(bodyparser.urlencoded({ extended: false }))
App.use(cors())
App.use("/users", Users)
App.use("/seller", Seller)

App.listen(PORT, () => {
  console.log(`server is running in PORT${PORT}`)
})

