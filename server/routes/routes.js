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
    newTask.blocked = (req.body.blocked === 'true');
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

router.route('/updateTask').post(
  (req, res) => {
    var updates = {
      name: req.body.name,
      plannedTime: Number(req.body.plannedTime),
      spentTime: Number(req.body.spentTime),
      status: req.body.status,
      // person: req.body.person === 'null' ? null : mongoose.Types.ObjectId(req.body.person),
      description: req.body.description,
      blocked: (req.body.blocked === 'true'),
      tags: req.body.tags.split(' ').filter((tag) => tag !== ''),
    }

    task.update({ _id: req.body._id }, updates, (err, _raw) => {
      if(!err) {
        res.send("Zapisano!");
      }
    });
  }
);

router.route('/newSprint').post(
  (req, res) => {
    var newSprint = new sprint();
    newSprint.sprintForTeams = [];
    newSprint.start = Date(req.body.start);
    newSprint.end = Date(req.body.end);
    newSprint.number = req.body.number;

    var sftIds = [];

    newSprint.save().then((value) => {
      var sprintId = value._id;

      team.aggregate([{ $project: { "_id": 1, "sprintsForTeam": 1 } }]).then(
        (teams) => {
          return Promise.all(teams.map((singleTeam) => {
            let newSprintForTeam = new sprintForTeam();
  
            newSprintForTeam.sprint = sprintId;
            newSprintForTeam.team = singleTeam._id;
            newSprintForTeam.goal = '';

            return newSprintForTeam.save().then(
              (sft) => {
                sftIds.push(sft._id);

                var teamUpdate = {
                  sprintsForTeam: singleTeam.sprintsForTeam + sft._id,
                };

                team.update({ _id: singleTeam._id }, teamUpdate);
              }
            );
          })).then(
            (_res) => {
              var sprintUpdate = {
                sprintForTeams: sftIds,
              };
    
              sprint.update({ _id: sprintId }, sprintUpdate, (err, _raw) => {
                if(!err) {
                  res.send("Zapisano!");
                }
              });
            }
          );
        }
      )
    })
  }
)

router.route('/taggedTasks').post(
  (req, res) => {
    var tags = req.body.tags.split(' ').filter((tag) => tag !== '');
    task.find(
      { tags: { $all: tags } },
      (err, innerRes) => {
        res.json({
          tasks: innerRes,
        });
      }
    );
  }
);

router.route('/taggedBacklogs').post(
  (req, res) => {
    var tags = req.body.tags.split(' ').filter((tag) => tag !== '');
    backlog.find(
      { tags: { $all: tags } },
      (err, innerRes) => {
        res.json({
          backlogs: innerRes,
        });
      }
    );
  }
);

router.route('/newBacklog').post(
  (req, res) => {
    var newBacklog = new backlog();
    newBacklog.name = req.body.name;
    newBacklog.effort = Number(req.body.effort);
    newBacklog.sprintForTeam = mongoose.Types.ObjectId(req.body.sprintForTeam);
    newBacklog.description = req.body.description;
    newBacklog.blocked = (req.body.blocked === 'true');
    newBacklog.tags = req.body.tags.split(' ').filter((tag) => tag !== '');

    newBacklog.save((err) => {
      if(!err) {
        res.send("Dodano!");
      }
    });
  }
);

router.get('/deleteBacklog/:id', (req, res) => {
  var id = req.params.id;

  backlog.findById(id, (err, innerRes) => {
    innerRes.remove((err) => {
      if(!err) {
        res.send("Usunięto!");
      }
    })
  });
});

router.route('/updateBacklog').post(
  (req, res) => {
    var updates = {
      name: req.body.name,
      effort: Number(req.body.effort),
      description: req.body.description,
      blocked: (req.body.blocked === 'true'),
      tags: req.body.tags.split(' ').filter((tag) => tag !== ''),
    }

    backlog.update({ _id: req.body._id }, updates, (err, _raw) => {
      if(!err) {
        res.send("Zapisano!");
      }
    });
  }
);

module.exports = router;