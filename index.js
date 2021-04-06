const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyt5e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection("books");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");


  app.get('/books', (req, res) => {
    bookCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
  })

    app.get('/orders',(req, res) =>{
      orderCollection.find()
      .toArray((err,documents) =>{
        res.send(documents);
      })
    })
    app.get('/order',(req, res) =>{
      orderCollection.find({"loggedInUser.email":req.query.email})
      .toArray((err,documents) =>{
        res.send(documents);
      })
    })

  app.post('/admin', (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteOrder/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    orderCollection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
  })
});

})
app.listen(port);