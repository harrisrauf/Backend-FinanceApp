let express=require('express');
let auth=require('../services/auth');
const authRoutes=express.Router();

authRoutes.post('/login',auth.login);


module.exports=authRoutes