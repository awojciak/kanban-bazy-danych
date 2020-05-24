import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import '../../css/App.css';
var querystring = require('querystring');

ReactModal.setAppElement("#root")

export const ChooseTabForm = ({sprints, teams, callback}) => {
    const [sprintId, setSprintId] = useState(sprints[0]["_id"]);
    const [teamId, setTeamId] = useState(teams[0]["_id"]);

    const onSprintChange = (event) => {
        setSprintId(event.target.value);
    }

    const onTeamChange = (event) => {
        setTeamId(event.target.value);
    }

    const chooseTab = (event) => {
        event.preventDefault();
        callback(sprintId, teamId);
    }

    return (
        <div className="ChooseTabForm">
            <form className="InnerChooseTabForm">
                <select name="sprint" id="chooseSprint" onChange={onSprintChange}>
                    {sprints.map((sprint) => (
                        <option value={sprint["_id"]}>{`Sprint ${sprint.number}`}</option>
                    ))}
                </select>
                <select name="team" id="chooseTeam" onChange={onTeamChange}>
                    {teams.map((team) => (
                        <option value={team["_id"]}>{`Zespół ${team.name}`}</option>
                    ))}
                </select>
                <button type="button" id="chooseButton" onClick={chooseTab}>Przejdź do tablicy</button>
            </form>
        </div>
    )
}

export const BacklogModalForm = ({ isOpen, closeCb, id }) => {
    const [backlog, setBacklog] = useState(undefined);

    const style = {
        content: {
            height: '200px',
            width: '400px'
        }
    }

    useEffect(() => {
        if(isOpen) {
            axios.get('/backlog/'+id).then(
                (res) => {
                    setBacklog(res.data.backlog);
                }
            )
        }
    }, [isOpen]);

    return (
        <ReactModal isOpen={isOpen} style={style}>
            {!!backlog && (<form>
                <input name="name" value={backlog.name} />
                <input name="effort" type="number" value={backlog.effort} />
                <textarea name="description" value={backlog.description} />
                <input name="tags" value={backlog.tags[0]} />
                <input name="blocked" type="checkbox" checked={backlog.blocked} />
            </form>)}
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}

export const TaskModalForm = ({ isOpen, closeCb, id }) => {
    const [task, setTask] = useState(undefined);

    const style = {
        content: {
            height: '200px',
            width: '400px'
        }
    }

    useEffect(() => {
        if(isOpen) {
            axios.get('/task/'+id).then(
                (res) => {
                    setTask(res.data.task);
                }
            )
        }
    }, [isOpen]);

    const deleteTask = () => {
        axios.get('/deleteTask/'+id).then((res) => {
            console.log(res);
        }).finally(() => {
            closeCb();
        });
    }

    return (
        <ReactModal isOpen={isOpen} style={style}>
            {!!task && (<form>
                <input name="name" value={task.name} />
                <input name="plannedTime" type="number" value={task.plannedTime} />
                <input name="spentTime" type="number" value={task.spentTime} />
                <textarea name="description" value={task.description} />
                <input name="tags" value={task.tags[0]} />
                <input name="blocked" type="checkbox" checked={task.blocked} />
                <input name="person" value={task.person} />
                <input name="status" value={task.status} />
            </form>)}
            <button onClick={deleteTask}>Usuń taska</button>
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}

export const AddTaskModalForm = ({ isOpen, closeCb, backlogId }) => {
    const style = {
        content: {
            height: '200px',
            width: '400px'
        }
    }

    let task = {
        backlog: backlogId,
        status: "ToDo",
        person: null,
        spentTime: 0,
        name: '',
        plannedTime: 0,
        description: '',
        tags: '',
        blocked: false,
    }

    const saveTask = () => {
        axios.post(
            '/newTask',
            querystring.stringify(task), 
            {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).finally(() => {
            closeCb()
        })
    }

    const handleChange = (e) => {
        task[e.target.name] = e.target.value;
    }

    return (
        <ReactModal isOpen={isOpen} style={style}>
            <form>
                <input name="name" onChange={handleChange} />
                <input name="plannedTime" type="number" onChange={handleChange} />
                <textarea name="description" onChange={handleChange} />
                <input name="tags" onChange={handleChange} />
                <input name="blocked" type="checkbox" onChange={handleChange} />
                <button type="button" onClick={saveTask}>Zapisz taska</button>
            </form>
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}