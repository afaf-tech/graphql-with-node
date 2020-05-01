const express = require('express')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolver/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);


// ! not nullable / || never be null
app.use(
    '/graphql', 
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolver,
        graphiql:true
    })
);

mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`,{ useNewUrlParser: true , useUnifiedTopology:true})
    .then(()=>{
        console.log('db connected and server has been stated.');
        
        app.listen(3000);
    })
    .catch((err)=>{
        console.log(err);
    })


