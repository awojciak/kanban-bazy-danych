var express = require('express');
var bodyParser = require('body-parser');
var backlog = require('../models/backlog.model');
var person = require('../models/person.model');
var sprint = require('../models/sprint.model');
var sprintForTeam = require('../models/sprintForTeam.model');
var task = require('../models/task.model');
var team = require('../models/team.model');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/', function(req, res){
  res.render('index')
});

router.get('/sprintForTeam/:id', (req, res) => {
  var id = req.params.id;
  var oid = new mongoose.Types.ObjectId(id);

  sprintForTeam.findById(id, (err, innerRes) => {
      var initData = innerRes;

      sprint.findById(initData.sprint, (err, innerRes) => {
        var sprintData = innerRes;

        backlog.find({ sprintForTeam: oid }, (err, innerRes) => {
          var backlogs = innerRes;

          var newBacklogs = []
          for(var b of backlogs) {
            task.find({ backlog: b["_id"] }, (err, innerRes) => {
              var nb = {
                ...b["_doc"],
                tasks: innerRes
              };
              newBacklogs.push(nb);

              res.json(
                {
                  backlogs: newBacklogs,
                  number: sprintData.number,
                  start: sprintData.start,
                  end: sprintData.end
                }
              );
            });
          }
        });
      });
  });
});

module.exports = router;