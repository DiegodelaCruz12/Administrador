const express=require('express');
const app = express();
const router=express.Router();

const cors = require('cors');

app.use(cors());

router.get('/',(req,res)=> {
    res.render('index'); 
});
module.exports=router;