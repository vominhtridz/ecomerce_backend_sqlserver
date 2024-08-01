
import sqlConfig from "../models/UsersModel.js"
import sql from "mssql"
export const AddSellerPickUpAddress = async (req, res) => {
  const {
   addr,
sellerName,
phone,
detailaddr,
    setdefault,
userid
  } = req.body
  try {
    console.log(addr)
    const pool = await sql.connect(sqlConfig)
    const queryInsert = `INSERT INTO pickupaddr (userid, addr,sellerName,phone,detailaddr,setdefault) VALUES (${userid},N'${addr}', N'${sellerName}', '${phone}', N'${detailaddr}', ${setdefault ? 1 : 0})`
    await pool.request().query(queryInsert)
    console.log(userid)
    const result = await pool.request().query(`select * from pickupaddr where userid = ${userid}`)``
    res.status(200).json({ message: "Lưu thành công", data: result.recordset })
  } catch (err) {
   
    res
      .status(400)
      .json({ error: "Error occurred while adding seller pick-up address." })
  }
}
export const StorageSeller = async (req, res) => {
  const {
    userid,
    identifiImg,
    nameidentifi,
    busimg,
    transport,
    SellerName,
    phoneNumber,
    email,
    nameCompany,
    img,
    e_email,
    busaddr,
    taxcode,
    cccdnumber,
    cmndnumber,
  } = req.body

  try {
 
      let pool = await sql.connect(sqlConfig)
      const query = `select * from seller where userid = ${userid}`
      const ExitsSeller = await pool.request().query(query)
      if (ExitsSeller.recordset.length > 0) {
        const query = `UPDATE seller SET identifiImg = '${identifiImg}',nameidentifi = N'${nameidentifi}',nameCompany = N'${nameCompany}',busimg = '${busimg}', 
        transport = N'${transport}',
        img = '${img}',
        e_email = '${e_email}',
        busaddr = N'${busaddr}',
        taxcode = ${taxcode},
        cccdnumber = ${cccdnumber},
        cmndnumber = ${cmndnumber},
        WHERE userid = ${userid}`
        await pool.request().query(query)
        res.status(200).json({ message: "Cập nhật thành công" })
      } else {
        const queryInsert = `INSERT INTO seller ( userid,SellerName,Email,Phone) VALUES (${userid},N'${SellerName}', '${email}', '${phoneNumber}')`
        await pool.request().query(queryInsert)
        res.status(200).json({ message: "Lưu thành công" })
      }
  } catch (err) {
    res.status(400).json({ error: "Error occurred while adding seller pick-up address." })
  }
}
export const getPickUpAddr = async (req, res) => {
  const { userid } = await req.body
  try {
    const pool = await sql.connect(sqlConfig)
    const result = await pool.request().query(`select * from pickupaddr where userid = ${userid}`)
    res.json(result.recordset).status(200)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const GetSeller = async (req, res) => {
  const { userid } = await req.body
  try {
    const pool = await sql.connect(sqlConfig)
    const result = await pool.request().query(`select * from seller where userid = ${userid}`)
    res.json(result.recordset).status(200)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const ChangePickUpAddr = async (req, res) => {
  const { addr, sellerName, phone, detailaddr, setdefault ,addressid} = await req.body
  try {
    const pool = await sql.connect(sqlConfig)
    console.log(addr, sellerName, phone, detailaddr, setdefault, addressid)
    const query = `UPDATE pickupaddr SET addr = N'${addr}',sellerName = N'${sellerName}',phone = '${phone}',detailaddr = N'${detailaddr}',setdefault = '${setdefault}' WHERE addressid = ${addressid}`
        await pool.request().query(query)
    const result = await pool.request().query(`select * from pickupaddr where addressid = ${addressid}`)
     
      res.status(200).json({ message: "Cập nhật thành công", data: result.recordset })
    
  } catch {
    res.status(400).json({ message: "Hệ thống lỗi !" })
  }
}

