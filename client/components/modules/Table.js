import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import '../../css/App.css';
import { BacklogModalForm, TaskModalForm, AddTaskModalForm, AddBacklogModalForm, SetGoalModalForm } from './Forms';

ReactModal.setAppElement("#root")

export const PersonModal = ({ isOpen, closeCb, personId }) => {
    const [person, setPerson] = useState(undefined);

    const style = {
        content: {
            height: '100px',
            width: '300px'
        }
    }

    useEffect(() => {
        if(isOpen) {
            axios.get('/person/'+personId).then(
                (res) => {
                    setPerson(res.data.person);
                }
            )
        }
    }, [isOpen]);

    return (
        <ReactModal isOpen={isOpen} style={style}>
            {!!person && (
                <div className="TaskForm">
                    <span>{`Imię: ${person.name}`}</span>
                    <span>{`Nazwisko: ${person.surname}`}</span>
                    <span>{`Wymiar pracy: ${person.timePart}`}</span>
                </div>
            )}
            <button onClick={closeCb}>Zamknij</button>
        </ReactModal>
    );
}

export const Tag = ({ name }) => (
    <div className="Tag">{name}</div>
)

export const BacklogTile = ({ data }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={`BacklogTile${data.blocked ? ' BlockedTile': ''}`}>
            <span className="TileTitle">{data.name}</span>
            <span className="TileInfo">{`Effort: ${data.effort}`}</span>
            <div className="TileTags">
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
            <button onClick={() => setModalOpen(true)}>Pokaż szczegóły</button>
            <BacklogModalForm id={data["_id"]} isOpen={modalOpen} closeCb={() => setModalOpen(false)} />
        </div>
    );
}

export const TaskTile = ({ data }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [personOpen, setPersonOpen] = useState(false);

    return (
        <div className={`TaskTile${data.blocked ? ' BlockedTile': ''}`}>
            <span className="TileTitle">{data.name}</span>
            <span className="TileInfo">{`Całkowity czas: ${data.plannedTime}`}</span>
            <span className="TileInfo">{`Czas dotychczas spędzony: ${data.spentTime}`}</span>
            {
                data.person !== null
                ? (
                    <>
                        <button onClick={() => setPersonOpen(true)}>Informacje o wykonawcy</button>
                        <PersonModal personId={data.person} isOpen={personOpen} closeCb={() => setPersonOpen(false)} />
                    </>
                )
                : (
                    <span className="TileInfo">Bez wykonawcy</span>
                )
            }
            <div className="TileTags">
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
            <button onClick={() => setModalOpen(true)}>Pokaż szczegóły</button>
            <TaskModalForm id={data["_id"]} isOpen={modalOpen} closeCb={() => setModalOpen(false)} />
        </div>
    )
}

export const BacklogRow = ({ data }) => {
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/tasksForBacklog/'+data["_id"]).then(
            (res) => {
                setTasks(res.data.tasks);
            }
        )
    }, [data]);

    return (
        <div className="BacklogRow">
            <div className="BacklogCol">
                <BacklogTile data={data}/>
                <button onClick={() => setModalOpen(true)}>Dodaj taska</button>
                <AddTaskModalForm backlogId={data["_id"]} isOpen={modalOpen} closeCb={() => setModalOpen(false)} />
            </div>
            <div className="BacklogCol">
                {tasks.filter((task) => task.status === 'ToDo').map((task) => <TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {tasks.filter((task) => task.status === 'InProgress').map((task) => <TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {tasks.filter((task) => task.status === 'Done').map((task) => <TaskTile data={task} />)}
            </div>
        </div>
    );
}

export const Table = ({ id }) => {
    const [sprint, setSprint] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [goalModalOpen, setGoalModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/sprintForTeam/'+id).then(
            (res) => {
                setSprint(res.data);
            }
        )
    }, [id]);

    const refresh = () => {
        axios.get('/sprintForTeam/'+id).then(
            (res) => {
                setSprint(res.data);
            }
        )
    }

    if(typeof sprint === 'undefined') {
        return (
            <div className="TableHeader">Poczekaj chwilę</div>
        );
    }

    return (
        <div className="Table">
            <div className="TableHeader">
                {`Sprint ${sprint.number}: ${sprint.start} - ${sprint.end}`}
                <button onClick={() => setModalOpen(true)}>Nowy backlog</button>

                <button onClick={refresh}>Odśwież</button>
                <AddBacklogModalForm isOpen={modalOpen} closeCb={() => setModalOpen(false)} tabId={id} />

                <button onClick={() => setGoalModalOpen(true)}>Ustal cel sprintu</button>
                <SetGoalModalForm isOpen={goalModalOpen} closeCb={() => setGoalModalOpen(false)} id={id} goal={sprint.goal || ''} />
            </div>
            {sprint.goal.length > 0 && (
                <div className="Goal">
                    <div className="GoalHeader">Cel sprintu</div>
                    <div className="GoalContent">{sprint.goal}</div>
                </div>
            )}
            <div className="BacklogRow">
                <div className="BacklogCol">
                    <span className="ColHeader">Backlogi</span>
                </div>
                <div className="BacklogCol">
                    <span className="ColHeader">To do</span>
                </div>
                <div className="BacklogCol">
                    <span className="ColHeader">In progress</span>
                </div>
                <div className="BacklogCol">
                    <span className="ColHeader">Done</span>
                </div>
            </div>
            {sprint.backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}