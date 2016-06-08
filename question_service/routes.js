(() => {
  const express = require('express');
  const router = express.Router();

  let questions = require('./questions');

  //TEST METHOD
  router.get('/hi', (req, res) => {
    res.send("Hi to you to");
  });


  router.post('/question/new', (req, res) => {
    //get json from frontend and push a new question with the
    questions.addQuestions(req.body.question, req.body.tags);
    res.send("added a new question");

  });

  router.post('/questions', (req, res) => {
    let tags =  req.body.tags;

    let tagArr = tags.split(' ');

    questions.getQuestions(tagArr, req, res);

  });

  module.exports = router;
})();
