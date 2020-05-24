import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/App.css';
import { BacklogModalForm, TaskModalForm } from './Forms';

export const Tag = ({ name }) => (
    <div className="Tag">{name}</div>
)

export const BacklogTile = ({ data }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="BacklogTile">
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

    return (
        <div className="TaskTile">
            <span className="TileTitle">{data.name}</span>
            <span className="TileInfo">{`Całkowity czas: ${data.plannedTime}`}</span>
            <span className="TileInfo">{`Czas dotychczas spędzony: ${data.spentTime}`}</span>
            <span className="TileInfo">{`Wykonawca: ${data.person}`}</span>
            <div className="TileTags">
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
            <button onClick={() => setModalOpen(true)}>Pokaż szczegóły</button>
            <TaskModalForm id={data["_id"]} isOpen={modalOpen} closeCb={() => setModalOpen(false)} />
        </div>
    )
}

export const BacklogRow = ({ data }) => {
    return (
        <div className="BacklogRow">
            <div className="BacklogCol">
                <BacklogTile data={data}/>
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'ToDo').map((task) => <TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'InProgress').map((task) => <TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'Done').map((task) => <TaskTile data={task} />)}
            </div>
        </div>
    );
}

export const Table = ({ id }) => {

    const [sprint, setSprint] = useState(undefined);

    useEffect(() => {
        axios.get('/sprintForTeam/'+id).then(
            (res) => {
                setSprint(res.data);
            }
        )
    }, [id]);

    if(typeof sprint === 'undefined') {
        return (
            <div className="TableHeader">Poczekaj chwilę</div>
        );
    }

    return (
        <div className="Table">
            <div className="TableHeader">{`Sprint ${sprint.number}: ${sprint.start} - ${sprint.end}`}</div>
            {sprint.backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}