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

          res.json(
            {
              backlogs: backlogs,
              number: sprintData.number,
              start: sprintData.start.toDateString(),
              end: sprintData.end.toDateString()
            }
          );
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

router.get('/tasksForBacklog/:id', (req, res) => {
  var id = req.params.id;

  task.find({ backlog: id }, (err, innerRes) => {
    res.json({
      tasks: innerRes
    })
  });
});

router.route('/newTask').post(
  (req, res) => {
    var newTask = new task();
    newTask.name = req.body.name;
    newTask.plannedTime = Number(req.body.plannedTime);
    newTask.spentTime = 0;
    newTask.backlog = mongoose.Types.ObjectId(req.body.backlog);
    newTask.status = "ToDo";
    newTask.person = null;
    newTask.description = req.body.description;
    newTask.blocked = Boolean(req.body.blocked);
    newTask.tags = req.body.tags.split(' ').filter((tag) => tag !== '');

    newTask.save((err) => {
      if(!err) {
        res.send("Dodano!");
      }
    });
  }
);

router.get('/deleteTask/:id', (req, res) => {
  var id = req.params.id;

  task.findById(id, (err, innerRes) => {
    innerRes.remove((err) => {
      if(!err) {
        res.send("Usunięto!");
      }
    })
  });
});

module.exports = router;