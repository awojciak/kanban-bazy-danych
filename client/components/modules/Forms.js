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
            {!!backlog && (<form className="BacklogForm">
                <label>
                    Tytuł: 
                    <input name="name" value={backlog.name} />
                </label>
                <label>
                    Effort: 
                    <input name="effort" type="number" value={backlog.effort} />
                </label>
                <label>
                    Opis: 
                    <textarea name="description" value={backlog.description} />
                </label>
                <label>
                    Tagi: 
                    <input name="tags" value={backlog.tags[0]} />
                </label>
                <label>
                    Czy zablokowany: 
                    <input name="blocked" type="checkbox" checked={backlog.blocked} />
                </label>
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
            {!!task && (<form className="TaskForm">
                <label>
                    Tytuł:
                    <input name="name" value={task.name} />
                </label>
                <label>
                    Planowany czas:
                    <input name="plannedTime" type="number" value={task.plannedTime} />
                </label>
                <label>
                    Spędzony czas:
                    <input name="spentTime" type="number" value={task.spentTime} />
                </label>
                <label>
                    Opis:
                    <textarea name="description" value={task.description} />
                </label>
                <label>
                    Czy zablokowany:
                    <input name="blocked" type="checkbox" checked={task.blocked} />
                </label>
                <label>
                    Wykonawca:
                    <input name="person" value={task.person} />
                </label>
                <label>
                    Status:
                    <input name="status" value={task.status} />
                </label>
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
            <form className="AddTaskForm">
                <label>
                    Tytuł:
                    <input name="name" onChange={handleChange} />
                </label>
                <label>
                    Planowany czas:
                    <input name="plannedTime" type="number" onChange={handleChange} />
                </label>
                <label>
                    Opis:
                    <textarea name="description" onChange={handleChange} />
                </label>
                <label>
                    Tagi:
                    <input name="tags" onChange={handleChange} />
                </label>
                <label>
                    Czy zablokowany:
                    <input name="blocked" type="checkbox" onChange={handleChange} />
                </label>
                <button type="button" onClick={saveTask}>Zapisz taska</button>
            </form>
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}

export const SearchTasksModal = ({ isOpen, closeCb }) => {
    const style = {
        content: {
            height: '200px',
            width: '400px'
        }
    };

    const [tasks, setTasks] = useState(undefined);
    const [tags, setTags] = useState(undefined);

    const searchHandler = () => {
        axios.post(
            '/taggedTasks',
            querystring.stringify({ tags: tags }), 
            {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).then(
            (res) => {
                setTasks(res.data.tasks);
            }
        );
    };

    const handleChange = (e) => {
        setTags(e.target.value);
    }

    return (
        <ReactModal isOpen={isOpen} style={style}>
            <form className={'SearchForm'}>
                <label>
                    Tagi:
                    <input name="tags" onChange={handleChange}/>
                </label>
                <button type="button" onClick={searchHandler}>Szukaj</button>
            </form>
            {typeof tasks !== 'undefined' && (
                <div className={'SearchWrapper'}>
                    {tasks.map((task) => (
                        <button>{task.name}</button>
                    ))}
                </div>
            )}
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    )
}

export const SearchBacklogsModal = ({ isOpen, closeCb }) => {
    const style = {
        content: {
            height: '200px',
            width: '400px'
        }
    };

    const [backlogs, setBacklogs] = useState(undefined);
    const [tags, setTags] = useState(undefined);

    const searchHandler = () => {
        axios.post(
            '/taggedBacklogs',
            querystring.stringify({ tags: tags }), 
            {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).then(
            (res) => {
                setBacklogs(res.data.backlogs);
            }
        );
    };

    const handleChange = (e) => {
        setTags(e.target.value);
    }

    return (
        <ReactModal isOpen={isOpen} style={style}>
            <form className={'SearchForm'}>
                <label>
                    Tagi:
                    <input name="tags" onChange={handleChange}/>
                </label>
                <button type="button" onClick={searchHandler}>Szukaj</button>
            </form>
            {typeof backlogs !== 'undefined' && (
                <div className={'SearchWrapper'}>
                    {backlogs.map((backlog) => (
                        <button>{backlog.name}</button>
                    ))}
                </div>
            )}
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    )
}