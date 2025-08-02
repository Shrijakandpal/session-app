import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const router=express.Router();

router.post('/register', async (req,res)=>{
    const { name, email, password } = req.body;
    try{
        const existingUser= await User.findOne({email});
        if(existingUser)
            return res.status(400).json({message:'User already exists'});
        
        const hashedPass = await bcrypt.hash(password,10);

        const newUser= new User({ name, email , password : hashedPass});
        await newUser.save();

        res.status(201).json({ message : 'user registered successfully!!'});
        
    }
    catch (error){
        res.status(500).json({message : ' Error in registartion! ', error});

    }    
});
router.post('/login', async (req,res)=>{
    const { email, password} = req.body;
    try{
        const user= await User.findOne({email});
        if(!user)
            return res.status(404).json({message : 'user not found'});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({message : ' invalid credentials'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn :'10d'});
        res.status(200).json({token, user :{id: user._id, name: user.name, email : user.email}});
    }
    catch (error){
        res.status(500).json({ message :' Error in logic', error});


    }

});
export default router;