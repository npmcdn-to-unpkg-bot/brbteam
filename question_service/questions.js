(() => {
  var nools = require('nools');

  var ruleFilePath = __dirname + "/questions.nools";

  var flow = nools.compile(ruleFilePath);
  var session = flow.getSession();

  var Questions = flow.getDefined('Questions');
  session.assert(new Questions(["nodejs"]));
  session.assert(new Questions(["mongo", "db"]));

  session.match();
})();
