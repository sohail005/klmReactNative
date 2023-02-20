var express = require('express');
var router = express.Router();
const config = require('../../configurations/config');

router.post('/', function (req, res, next) {
    
    let state = '';
    let token  = '';
    if(req != undefined && req.body != undefined) {
            state = req.body.state;
            token =  JSON.stringify(req.body);
    
            res.writeHead(301,
                { Location: config.SiteUrl + state + '?code=' + token  }
              );
              res.end();
    } 
    else{
        res.writeHead(301,
            { Location: config.SiteUrl + 'users/sign_in'  }
          );
          res.end();
    }

    
});

module.exports = router;