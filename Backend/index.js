const express = require('express');
const app = express();
const port = 3000;
const User = require('./Database/models/User');
const dbConnect = require('./Database/connect')

//Middleware for parsing json
app.use(express.json());

//Registration
app.post('/register', async(req,res)=>{
  try{
    const{name,email,password} = req.body;
    console.log(req.body);
    const user = new User({name,email,password});
    await user.save();
    res.status(201).json({Message:'Registration Successfull'});
  }
  catch(error)
  {
    res.status(500).json({error:'Registration Failed'})
  }
  
})

dbConnect();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

