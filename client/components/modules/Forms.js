import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import '../../css/App.css';

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
                        <option value={sprint.id}>{`Sprint ${sprint.number}`}</option>
                    ))}
                </select>
                <select name="team" id="chooseTeam" onChange={onTeamChange}>
                    {teams.map((team) => (
                        <option value={team.id}>{`Zespół ${team.name}`}</option>
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
                    setBacklog(res.data.task);
                }
            )
        }
    }, [isOpen]);

    return (
        <ReactModal isOpen={isOpen} style={style}>
            {!!task && (<form>
                <input name="name" value={task.name} />
                <input name="plannedTime" type="number" value={backlog.plannedTime} />
                <input name="spentTime" type="number" value={backlog.spentTime} />
                <textarea name="description" value={backlog.description} />
                <input name="tags" value={backlog.tags[0]} />
                <input name="blocked" type="checkbox" checked={backlog.blocked} />
                <input name="person" value={task.person} />
                <input name="status" value={task.status} />
            </form>)}
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}