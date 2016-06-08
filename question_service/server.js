(() => {
  const express = require('express');
  const app =  express();
  const cors = require('cors');
  const router = require('./routes');
  const bodyParser = require('body-parser');

  const port = 4000;

  app.listen(port, () => {
    console.log("Question recomendation system is running on " + port);
  });

  app.use(bodyParser.urlencoded({extended : true}));
  app.use(bodyParser.json());

  //exposing the api
  app.use(cors());
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With' );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.use('/api', router);


})();
