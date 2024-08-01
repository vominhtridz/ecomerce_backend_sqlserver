import express from "express";
import {
  GetUsers,
  RegisterUser,
  UserLoggedIn,
  VerificationEmail,
  ResetPwd,
  VerifiEmailUser,
  ChangeEmailUser,
  ChangePhoneNumber,
  StoreUserBank,
  StoreUserCard,
  ChangeUserProfile,
  GetUserCard,
  GetUserAddress,
  RemoveBankACC,
  RemoveCardACC,
  RemoveAddr,
  UpdateAddress,
  UserAddress,
  GetUserBank,
  ChangePassword,
} from "../controllers/UsersControllder.js"
const Router = express.Router()
// ------------ GET USER----------------
Router.post("", GetUsers)
Router.post("/get/address", GetUserAddress)
Router.post("/get/usercard", GetUserCard)
Router.post("/get/userbank", GetUserBank)
// ------------ USER PROFILE----------------
Router.post("/profile", ChangeUserProfile)
Router.post("/bank", StoreUserBank)
Router.post("/card", StoreUserCard)
Router.post("/address", UserAddress)
Router.post("/changeEmail", ChangeEmailUser)
Router.post("/changepwd", ChangePassword)
Router.post("/phonenumber", ChangePhoneNumber)
Router.post("/VerifiEmailUser", VerifiEmailUser)
// ------------------- PART LOGIN -------------
Router.post("/register", RegisterUser)
Router.post("/verifiemail", VerificationEmail)
Router.post("/resetpwd", ResetPwd)
Router.post("/login", UserLoggedIn)
// -----------------PART REMOVE--------------------
Router.post("/remove/bank", RemoveBankACC)
Router.post("/remove/card", RemoveCardACC)
Router.post("/remove/address", RemoveAddr)
// -----------------PART UPDATE--------------------
Router.post("/card", StoreUserCard)
Router.put("/update/addr", UpdateAddress)


export default Router;