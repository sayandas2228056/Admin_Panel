const express = require("express");
const cors = require("cors");  // ✅ Import cors
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hello World")
})


app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
