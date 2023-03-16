const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');


const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    const userExists = await User.findOne({ email });
    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    else{
        
    }
})