(() => {

  let exec = require('child_process').exec;
  let fs = require('fs');

class CodeCtrl {
  executeCode(req, res) {

    let currCmd = "";
    let currExt = "";

    let code = req.body.code;
    let type = req.body.type;

    console.log(type);

    if(type == "javascript" ){
      currCmd = 'node ./tmp/hello.js';
      currExt  = ".js";
    } else if (type == "python") {
      currCmd = 'python ./tmp/hello.py';
      currExt  = ".py";
    } else if (type == "ruby") {
      currCmd = 'ruby ./tmp/hello.rb';
      currExt  = ".rb";
    } else if (type == "php") {
      currCmd = 'php ./tmp/hello.php';
      currExt  = ".php";
    }

    console.log(currCmd);

    fs.writeFile("./tmp/hello" + currExt, code, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");

      exec(currCmd, function(error, stdout, stderr) {

        res.status(200);

        if(stdout) {
          res.json({"stdout" : stdout});
        } else {
          res.json({"stdout" : stderr});
        }


      });

  });



  }

}

module.exports = new CodeCtrl;

})()
