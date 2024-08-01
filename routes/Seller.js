import express from "express"
import {
  AddSellerPickUpAddress,
  StorageSeller,
  getPickUpAddr,
  ChangePickUpAddr,
  GetSeller,
} from "..//controllers/SellerController.js"
const Router = express.Router()
Router.post("/pickupaddr", AddSellerPickUpAddress)
Router.post("/pickupaddr/get", getPickUpAddr)
Router.put("/pickupaddr/change", ChangePickUpAddr)
Router.post("/storage", StorageSeller)
Router.post("/get", GetSeller)



export default Router
