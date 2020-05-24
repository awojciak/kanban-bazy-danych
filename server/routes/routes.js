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
                  start: sprintData.start.toDateString(),
                  end: sprintData.end.toDateString()
                }
              );
            });
          }
        });
      });
  });
});

router.get('/getChooseFormData', (req, res) => {
  sprint.aggregate([{ $project: {
    "_id": 1,
    "number": 1
  }}]).then(
    (sprints) => {
      team.aggregate([{ $project: {
        "_id": 1,
        "name": 1
      }}]).then((teams) => {
        res.json({
          sprints: sprints,
          teams: teams
        })
      })
    }
  )
});

router.get('/getTabId/:sprint/:team', (req, res) => {
  var sprintId = req.params.sprint;
  var teamId = req.params.team;

  sprintForTeam.findOne({ sprint: sprintId, team: teamId }, (req, innerRes) => {
    res.json({
      tabId: innerRes["_id"]
    });
  });
});

router.get('/backlog/:id', (req, res) => {
  var id = req.params.id;

  backlog.findById(id, (req, innerRes) => {
    res.json({
      backlog: innerRes
    });
  });
});

router.get('/task/:id', (req, res) => {
  var id = req.params.id;

  task.findById(id, (req, innerRes) => {
    res.json({
      task: innerRes
    });
  });
});

module.exports = router;