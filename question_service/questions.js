(() => {
  let nools = require('nools');
  let fs = require('fs');
  let shortid = require('shortid');

  class QuestionsResonator {

    constructor() {
      this.setup();
    }

    setup() {
      this.ruleFilePath = __dirname + "/questions.nools";
      this.flow = nools.compile(this.ruleFilePath);
      this.session = this.flow.getSession();
      this.Questions = this.flow.getDefined('Questions');
    }

    addQuestions(question, tags) {

      var questionDsl = "\n rule Rule" + shortid.generate() +" { " +
        "when {" +
          this.generateTagsDsl(tags) +
        "}" +
        "then {" +
          "out.matchedQuestions.push('" + question + "');\n" +
          "out.matchedTags.push('" + tags[0] + "');" +
        "}}\n";

      fs.appendFile(this.ruleFilePath, questionDsl, () => {
        nools.deleteFlows();
        this.setup();
      });

    }

    getQuestions(tags, req, res) {

      let questions = [];
      let matchedTags = [];
      let currQuestion = new this.Questions(tags, questions, matchedTags);

      this.session.assert(currQuestion);

      this.session.match((err) => {
        if(err) {
          console.log(err.stack);
        } else {
          console.log(matchedTags);
          res.status(200);
          res.json(questions);
        }
      });
    }

    // private
    generateTagsDsl(tags) {
      if(tags.length === 0) {
        return "out: Questions '' in out.tags";
      } else {

        let tagStr = "out: Questions ";

        for(let i = 0; i < tags.length; ++i) {
          tagStr +=  "'" + tags[i] + "' in out.tags";

          //add OR as long as it's no the last tag
          if(i !== tags.length-1) {
            tagStr += " || ";
          }

        }

        return tagStr;
      }

    }


  }

  module.exports = new QuestionsResonator;

})();
