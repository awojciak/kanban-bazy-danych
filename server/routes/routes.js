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

  sprintForTeam.findOne({ sprint: sprintId, team: teamId }, (err, innerRes) => {
    if(innerRes === null) {
      res.json({
        tabId: null
      });
    } else {
      res.json({
        tabId: innerRes["_id"]
      });
    }
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
    backlog.findById(innerRes.backlog, (req, blRes) => {
      sprintForTeam.findById(blRes.sprintForTeam, (req, sftRes) => {
        team.findById(sftRes.team, (req, teamRes) => {
          person.find({ _id: { $in: teamRes.members } }, (req, peopleRes) => {
            res.json({
              task: innerRes,
              members: peopleRes,
            });
          });
        });
      });
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
      person: (req.body.person === 'Brak wykonawcy') ? null : mongoose.Types.ObjectId(req.body.person),
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
    newSprint.start = new Date(req.body.start);
    newSprint.end = new Date(req.body.end);
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
                  sprintsForTeam: singleTeam.sprintsForTeam.concat([sft._id]),
                };

                team.update({ _id: singleTeam._id }, teamUpdate);

                return true;
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

router.get('/person/:id', (req, res) => {
  var id = req.params.id;

  person.findById(id, (req, innerRes) => {
    res.json({
      person: innerRes
    });
  });
});

router.get('/team/:id', (req, res) => {
  var id = req.params.id;

  team.findById(id, (req, innerRes) => {
    res.json({
      team: innerRes
    });
  });
});

router.route('/newPerson').post(
  (req, res) => {
    var newPerson = new person();
    newPerson.name = req.body.name;
    newPerson.surname = req.body.surname;
    newPerson.timePart = req.body.timePart;
    
    newPerson.save((err, doc) => {
      team.findById(req.body.team, (req, innerRes) => {
        var teamUpdate = {
          members: innerRes.members.concat([doc._id])
        }

        team.update({ _id: innerRes.id }, teamUpdate, (err, _raw) => {
          if(!err) {
            res.send("Dodano!");
          }
        })
      });
    });
  }
);

router.route('/newTeam').post(
  (req, res) => {
    var newTeam = new team();
    newTeam.name = req.body.name;
    newTeam.members = [];
    newTeam.sprintsForTeam = []

    newTeam.save((err) => {
      if(!err) {
        res.send("Dodano!");
      }
    });
  }
);

router.get('/allPeople', (req, res) => {
  person.aggregate([{
    $project: {
      "_id": 1,
      "name": 1,
      "surname": 1
    }
  }]).then((innerRes) => {
    res.json({
      people: innerRes,
    })
  })
});

router.get('/tasksForPerson/:id', (req, res) => {
  var id = req.params.id;

  task.find({ person: id }, (err, innerRes) => {
    res.json({
      tasks: innerRes
    })
  });
});

module.exports = router;