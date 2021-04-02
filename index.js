const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
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

    app.get('/order',(req, res) =>{
      orderCollection.find()
      .toArray((err,documents) =>{
        res.send(documents[0]);
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

  // app.patch('/updateBook/:id', (req, res) => {
  //   bookCollection.updateOne({_id: ObjectID(req.params.id)},
  //   {
  //     $set: {name: req.body.name, author: req.body.author, price: req.body.price}
  //   })
  //   .then( result => {
  //     res.send(result.modifiedCount > 0)
  //   })
  // })

  app.post('/addOrder',(req, res) => {
    const order = req.body;
    console.log(order);
        orderCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
  })
});

})
app.listen(port);