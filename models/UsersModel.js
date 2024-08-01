
const sqlConfig = {
  user: "testConnect",
  password: "123456",
  server: "ADMIN",
  database: "UsersDB",
  options: {
    encrypt: false, // Tắt mã hóa
    trustServerCertificate: true, // Tin tưởng chứng chỉ từ máy chủ
  },
}
export default sqlConfig
