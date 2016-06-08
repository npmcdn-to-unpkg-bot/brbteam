(() => {
  let nools = require('nools');

  class QuestionsResonator {

    constructor() {
      this.ruleFilePath = __dirname + "/questions.nools";
      this.flow = nools.compile(this.ruleFilePath);
      this.session = this.flow.getSession();
      this.Questions = this.flow.getDefined('Questions');
    }

    addQuestions(question, tags) {

    }

    getQuestions(tags, req, res) {

      let questions = [];
      let currQuestion = new this.Questions(tags, questions);

      this.session.assert(currQuestion);

      this.session.match((err) => {
        if(err) {
          console.log(err.stack);
        } else {
          res.status(200);
          res.json(questions);
        }
      });
    }




  }

  module.exports = new QuestionsResonator;

})();
