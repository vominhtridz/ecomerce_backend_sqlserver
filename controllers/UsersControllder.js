
import sqlConfig from "../models/UsersModel.js"
import sql from 'mssql'
import { transporter } from "../models/NodeMailer.js"
import { generateVerificationCode } from "./index.js"

// ----------------------------------STORAGE USER BANK-----------------------------
export const StoreUserBank = async (req, res) => {
  const {userid,defaultname,namebank,cid,namebranch,accountnumber,setdefault,fullname} = req.body
  try {
  let pool = await sql.connect(sqlConfig)
    const queryInsert = ` UPDATE userbank SET setdefault = 0 where userid = ${userid}
      INSERT INTO userbank (userid, defaultname,namebank,cid,namebranch,accountnumber,setdefault,fullname) VALUES (${userid}, N'${defaultname}', N'${namebank}', '${cid}', N'${namebranch}', '${accountnumber}',${setdefault ? 1:0}, N'${fullname}')`
    await pool.request().query(queryInsert)
    let result = await pool.request().query(`select * from userbank where userid = ${userid}`)
      res.status(200).json({ message: "Lưu thành công", data: result.recordset })
  }
  catch {
       res.status(400).json({ message: "Hệ thống lỗi !" })

  }
}

// ----------------------------------STORAGE USER CARD-----------------------------
export const StoreUserCard = async (req, res) => {
  const { userid, cardnumber, exp_day, codecvv, first_lastname, address, primaryCode } = req.body
  try {
    let pool = await sql.connect(sqlConfig)
    console.log(userid, cardnumber, exp_day, codecvv, first_lastname, address, primaryCode)
   const queryInsertUserCard = `INSERT INTO usercard (userid, cardnumber, first_lastname, exp_date, addr, postal_code, cvvcode) VALUES (${userid}, '${cardnumber}', N'${first_lastname}', '${exp_day}', N'${address}', N'${primaryCode}', '${codecvv}')`
    await pool.request().query(queryInsertUserCard)
  let result = await pool.request().query(`select * from usercard where userid = ${userid}`)
  res.status(200).json({ message: "Lưu thành công", data: result.recordset })
   
 } catch {
   res.status(400).json({ message: "Hệ thống lỗi !" })
 }
}
// ----------------------------------CHANGE USER PROFILE-----------------------------
export const ChangeUserProfile = async (req, res) => {
  const {img, username, defaultName, onetimes, email, gender, birthday } = await req.body
  try {
    let newUserQuery = `select * from Users where email = '${email}'`
    let pool = await sql.connect(sqlConfig)
    const queryChangeName = `select onechangename,username from Users where email = '${email}'`
    const selectuserNameexits = `select * from Users where username = '${username}'`
    const checkONC = (await pool.request().query(queryChangeName)).recordset.onechangename
    const checkusername = await pool.request().query(selectuserNameexits)
    // check username is exit
    if (checkusername.recordset.length > 0 && onetimes == 0) return res.status(400).json({ message: "Tên người dùng tồn tại" })
    // check ONC is true and onetimes is 1
    else if (checkONC == true && onetimes == 1) {
      const query = `UPDATE users SET img = '${img}'
      ,defaultName = '${defaultName}',
      gender = '${gender}',
      birthday = '${birthday}' WHERE  email = '${email}'`
      await pool.request().query(query)
      const newUser = await pool.request().query(newUserQuery)
      res.status(200).json({ message: "Lưu hồ sơ thành công.", data: newUser.recordset })
    } else {
      const query = `UPDATE users SET img = '${img}',username = '${username}'
      ,defaultName = '${defaultName}',
      gender = '${gender}',
      onechangename = 1,
      birthday = '${birthday}' WHERE  email = '${email}'`
      await pool.request().query(query)
      const newUser = await pool.request().query(newUserQuery)
      res.status(200).json({ message: "Lưu hồ sơ thành công.", data: newUser.recordset })
    }
    
  } catch {
    res.status(400).json({ message: "Hệ thống lỗi !" })
  }
}
export const UserAddress = async (req, res) => {
  const { userid, first_lastname, detailaddr, phonenumber, addr, setdefault } = req.body
  try {
    let pool = await sql.connect(sqlConfig)
    const queryInsertUserCard = `UPDATE useraddress SET setdefault = 0 where userid = ${userid}
    INSERT INTO useraddress (userid, first_lastname, detailaddr, phonenumber, addr, setdefault) VALUES (${userid}, N'${first_lastname}', N'${detailaddr}', '${phonenumber}', N'${addr}', ${setdefault ? 1 : 0})`
    const cc = await pool.request().query(queryInsertUserCard)
    console.log(cc)
    let result = await pool.request().query(`select * from useraddress where userid = ${userid}`)
    res.status(200).json({ message: "Lưu thành công", data: result.recordset})
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ message: "Hệ thống lỗi !" })
  }
}
// ----------------------------------CHANGE USER EMAIL-----------------------------
export const ChangeEmailUser = async (req, res) => {
  const { email, oldemail } = await req.body
  try {
    let pool = await sql.connect(sqlConfig)
    const selectEmail = `select * from Users where email = '${email}'`
    const checkEmail = await pool.request().query(selectEmail)
    if (checkEmail.recordset.length > 0) {
      res.status(400).json({ message: "Email có sẵn trên hệ thống!" })
    }
    else {
      const query = `UPDATE users SET email = '${email}' WHERE email = '${oldemail}'`
      const updateEmail = await pool.request().query(query)
      res
        .status(200)
        .json({ message: "Đổi email thành công", data: updateEmail })
    }
  } catch {
    res.status(400).json({ message: "Hệ thống lỗi !" })
  }
}
// ----------------------------------CHANGE USER PHONE NUMBER-----------------------------
export const ChangePhoneNumber = async (req, res) => {
  const { phonenumber, email } = await req.body
  try {
     let pool = await sql.connect(sqlConfig)
     const selectPN = `select * from Users where phonenumber = '${phonenumber}'`
     const checkPN = await pool.request().query(selectPN)
    
    if (checkPN.recordset.length > 0) {
      res.status(400).json({ message: "Số điện thoại đã tồn tại" })
    } else {
      const query = `UPDATE users SET phonenumber = '${phonenumber}' WHERE  email = '${email}'`
      const updateEmail = await pool.request().query(query)
      res
        .status(200)
        .json({ message: "Đổi số điện thoại thành công!", data: updateEmail })
    }

  } catch {
    res.status(400).json({ message: "Hệ thống lỗi" })
  }
}
export const ChangePassword = async (req, res) => {
  const { newpwd,userid, oldpwd } = await req.body
  try {
    if (newpwd == oldpwd) {
      return res.status(400).json({ message: "Mật khẩu trùng khớp với mật khẩu cũ." })
    }
    let pool = await sql.connect(sqlConfig)
    const query = `UPDATE users SET pwd = '${newpwd}' WHERE userid = ${userid}`
      const updateEmail = await pool.request().query(query)    
    res.status(200).json({ message: "Đổi mật khẩu thành công.", data: updateEmail })
  } catch {
    res.status(400).json({ message: "Hệ thống lỗi" })
  }
}
// ----------------------------------VERIFICATION USER EMAIL-----------------------------
export const VerifiEmailUser = async (req, res) => {
    const { email } = await req.body
  try { 
    const verificationCode = generateVerificationCode()
  let pool = await sql.connect(sqlConfig)
  const selectEmail = `select * from Users where email = '${email}'`
  const checkEmail = await pool.request().query(selectEmail)
     if (checkEmail.recordset.length > 0)
       return res.status(400).json({ message: "Email có sẵn trên hệ thống !" })
     else {
       const mailOptions = {
         from: "trilove151@gmail.com",
         to: email,
         subject: "Võ minh trí official",
         text: `Welcome to Sango Website: `,
         html: `<div>this is your code: <strong>${verificationCode}</strong></div> `,
       }
       // Send the email
       transporter.sendMail(mailOptions, function (error, info) {
         if (error) {
           res.send("Hệ thống lỗi!").status(404)
         } else
           res
             .status(200)
             .json({ codeverify: verificationCode, data: checkEmail.recordset })
       })
     }
  }
  catch {
    res.status(400).json({ message: "Hệ thống lỗi" })
  }
}
// ----------------------------------VERIFICATION EMAIL DEFAULT -----------------------------
export const VerificationEmail = async (req, res) => {
    const { email } = await req.body
  try {
    let pool = await sql.connect(sqlConfig)
    const verificationCode = generateVerificationCode()
    const selectEmail = `select * from Users where email = '${email}'`
    const checkEmail = await pool.request().query(selectEmail)

    if (checkEmail.recordset.length > 0) {
      const mailOptions = {
        from: "trilove151@gmail.com",
        to: email,
        subject: "Võ minh trí official",
        text: `Welcome to Sango Website: `,
        html: `<div>this is your code: <strong>${verificationCode}</strong></div> `,
      }
      // Send the email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
         res.send("Hệ thống lỗi!").status(404)

        } else res
          .status(200)
          .json({ codeverify: verificationCode, data: checkEmail.recordset })

      })
    }
    else res.send("Email không tồn tại").status(404)
    
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
// ----------------------------------RESET PASSWORD  -----------------------------
export const ResetPwd = async (req, res) => {
  const {email,newpwd} = await req.body
  try {

    let pool = await sql.connect(sqlConfig)
   await pool.request().query(`UPDATE Users
SET pwd ='${newpwd}'  WHERE email = '${email}'`)
    res.status(200).json({message: 'phục hồi mật khẩu thành công !'})
  } catch (err) {
    res.status(400).json({ error: err})
  }
}
// ----------------------------------GET ALL USERS  -----------------------------
export const GetUsers =async (req, res) => {
  const {userid}= req.body
  try {
    let pool = await sql.connect(sqlConfig)
    let result = await pool
      .request()
      .query(`select * from Users where userid = ${userid}`)
      res.send(result.recordset)

  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const GetUserAddress = async (req, res) => {
  const { userid } = req.body
  try {
    let pool = await sql.connect(sqlConfig)
    let result = await pool.request().query(`select * from useraddress where userid = ${userid}`)
    res.send(result.recordset)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const GetUserCard = async (req, res) => {
  const { userid } = req.body
try {
  let pool = await sql.connect(sqlConfig)
  let result = await pool.request().query(`select * from usercard where userid = ${userid}`)
  res.send(result.recordset)
}
catch (err) {
  res.status(400).json({ error: err })
  }
}
export const GetUserBank = async (req, res) => {
  const { userid } = req.body
try {
  let pool = await sql.connect(sqlConfig)
  let result = await pool.request().query(`select * from userbank where userid = ${userid}`)
  res.send(result.recordset)
} catch (err) {
  res.status(400).json({ error: err })
}}
// ----------------------------------REGISTER USER SANGO  -----------------------------

export const RegisterUser = async (req, res) => {
  const { email, pwd, username, phonenumber } = await req.body
  try {
    const selectEmail = `select * from Users where email = '${email}'`
    const selectUsername = `select * from Users where username = '${username}'`
    const selectphoneNum = `select * from Users where phonenumber = '${phonenumber}'`
    let pool = await sql.connect(sqlConfig)
    let result
    const checkEmail = await pool.request().query(selectEmail)
    const checkUsername = await pool.request().query(selectUsername)
    const checkPhoneNumber = await pool.request().query(selectphoneNum)
    const emailExits = {
      message: "Email tồn tại",
      data: email,
    }
    const userExits = {
      message: "username tồn tại",
      data: username,
    }
    const phoneNumExit = {
      message: "số điện thoại tồn tại",
      data: phonenumber,
    }
    if (checkEmail.recordset.length > 0) return res.status(400).json(emailExits)
    if (checkPhoneNumber.recordset.length > 0) return res.status(400).json(phoneNumExit)
    if (checkUsername.recordset.length > 0) return res.status(400).json(userExits)
    result = await pool.request()
    .query(`insert into Users (email,pwd,username,phonenumber, defaultName) 
    values ('${email}',N'${pwd}',N'${username}', ${phonenumber},N'${username}')`)
    res.send(result.recordset).status(200)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
// ---------------------------------- USER LOGEED IN WEB SANGO -----------------------------

export const UserLoggedIn = async (req, res) => {
  try {
    let pool = await sql.connect(sqlConfig)
    const { email, pwd,value, defaultName, img, googlelogin } = await req.body
    const selectEmail = `select * from Users where email = '${email}'`
    const selectValue = `select * from Users where (username = N'${value}' or email ='${value}'or phonenumber ='${value}') and pwd = N'${pwd}'`
    let result = await pool.request().query(selectEmail)
    const CheckEmail = await pool.request().query(selectEmail)
    const CheckValue = await pool.request().query(selectValue)
    const updateDFName = `UPDATE Users SET defaultName = '${defaultName}' WHERE email = '${email}'`
    const updateImg = `UPDATE Users SET img = '${img}' WHERE email = '${email}'`
    // login with google
    if (CheckEmail.recordset.length == 0 && googlelogin == true) 
    {
      await pool.request().query(`insert into Users (email,img,defaultName) 
          values ('${email}','${img}',N'${defaultName}')`);
      return res.json(result.recordset).status(200)
    }
    // if email exits
    else if (googlelogin == true) {
      if (result.recordset[0].img == null)await pool.request().query(updateImg)
      if (result.recordset[0].defaultName == null)await pool.request().query(updateDFName)
      return res.json(result.recordset).status(200)
    }
    // login normal by username phonenumber email
    if (CheckValue.recordset.length > 0) {
      console.log(CheckValue.recordset)
      return res.json(CheckValue.recordset).status(200)
    }
    else {
      return res.status(400).json({ message: "tài khoản hoặc mật khẩu không đúng!" })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
//
export const RemoveBankACC = async (req, res) => {
  const { userid ,bankid} = req.body
  try {
    let pool = await sql.connect(sqlConfig)
    console.log(userid,bankid)
    //------------ HANDLE REMOVE--------
      await pool.request().query(`delete from userbank where bankid = ${bankid}`)
    let result = await pool.request().query(`select * from userbank where userid = ${userid}`)
    res.send(result.recordset)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const RemoveCardACC = async (req, res) => {
  const { userid ,cardid} = req.body
  try {
    let pool = await sql.connect(sqlConfig)
    await pool.request().query(`delete from usercard where cardid = ${cardid}`)
    let result = await pool.request().query(`select * from usercard where userid = ${userid}`)
    res.send(result.recordset)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const RemoveAddr = async (req, res) => {
  const { userid, addrid } = req.body
  try {
    const pool = await sql.connect(sqlConfig)
    await pool.request().query(`delete from useraddress where addrid = ${addrid}`)
    const result = await pool.request().query(`select * from useraddress where userid = ${userid}`)
    res.send(result.recordset)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
//------------------------------------- UPDATE --------------
export const UpdateAddress = async (req, res) => {
  const { addrid,userid,first_lastname,detailaddr,phonenumber,addr,setdefault} = await req.body
  try {
    console.log(addrid, userid, first_lastname, detailaddr, phonenumber, addr, setdefault)
    // Connect to the SQL Server database using the configured pool
    const pool = await sql.connect(sqlConfig)
    // Construct the SQL query to update useraddress
    const query = `
            UPDATE useraddress 
            SET phonenumber = '${phonenumber}',
                addr = N'${addr}',
                setdefault = ${setdefault ? 1 : 0},
                detailaddr = N'${detailaddr}',
                first_lastname = N'${first_lastname}'
            WHERE addrid = ${addrid}`
    await pool.request().query(query)
    const result = await pool.request().query(`select * from useraddress where userid = ${userid}`)
    res.status(200).json({ message: "Cập nhật thành công.", data: result.recordset })
  } catch {
   res.status(400).json({ message: "Hệ thống lỗi." })
 }
}