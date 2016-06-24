(() => {
  const express = require('express');
  const router = express.Router();

  let code = require('./code.controller');


  router.post('/code/execute', code.executeCode);

  module.exports = router;
})();
