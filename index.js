const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 3004

app.use(cors())
app.use(express.json())
console.log(process.env.DB_name)
console.log(process.env.DB_password)




const uri = `mongodb+srv://${process.env.DB_name}:${process.env.DB_password}@cluster0.kkqbu90.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("insertitem");
    const haiku = database.collection("item");
    const addedprouct = client.db("insertitem");
    const haiku2 = addedprouct.collection("singleItem")
// get 
    app.get('/add',async(req,res)=>{
      const alladd = haiku.find()
      const result = await alladd.toArray()
      res.send(result)
    })
// get by id
    app.get('/add/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id:new ObjectId(id)}
      const result = await haiku.findOne(query);
      res.send(result)

    })
// add product for form
    app.post('/add',async(req,res)=>{
      const adddata = req.body
      const result = await haiku.insertOne(adddata);
      console.log(adddata)
      res.send(result)
    })
// update product in details
    app.put('/add/:id',async(req,res)=>{
      const id =req.params.id
     const filter ={_id:new ObjectId(id)}
     const options = { upsert: true };
     const Updatedcard=req.body
     const Updated ={
      $set:{
        name:Updatedcard.name,
        brand:Updatedcard.brand,
        type:Updatedcard.type,
        price:Updatedcard.price,
        photo:Updatedcard.photo,
        rating:Updatedcard.rating
      }
     }

     const result = await haiku.updateOne(filter, Updated, options);
     res.send(result)
    })

    // user added products 
    app.post('/user',async(req,res)=>{
      const addUser = req.body
      const result = await haiku2.insertOne(addUser);
      console.log(addUser)
      res.send(result)
    })

    // user added product get 

    app.get('/user',async(req,res)=>{
      const addedUsers= haiku2.find()
      const result = await addedUsers.toArray()
      res.send(result)
    })
    // user added pruduct delete 
    app.delete('/user/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id:id}
      const result = await haiku2.deleteOne(query);
      res.send(result)

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})