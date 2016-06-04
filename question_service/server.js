(() => {
  const express = require('express');
  const app =  express();
  const router = express.Router();

  const port = 4000;

  //let questionResonator = require('question');

  app.listen(port, () => {
    console.log("Question recomendation system is running on " + port);
  });

  app.use('/api', router);

  //TEST METHOD
  router.get('/hi', (req, res) => {
    res.send("Hi to you to");
  });


  router.post('questions/new', (req, res) => {
    //get json from frontend and push a new question with the
  });

})();
