const express = require("express");
const app = express();

//static folder
app.use(express.static(__dirname));

app.all('*',(req,res)=>{
    res.status(404).send('Resource not found')
})
app.listen(3000,()=>{
    console.log("I listen in port 3000...");
});