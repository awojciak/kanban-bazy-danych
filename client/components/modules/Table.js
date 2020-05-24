import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/App.css';

export const Tag = ({ name }) => (
    <div className="Tag">{name}</div>
)

export const BacklogTile = ({ data }) => {
    return (
        <div className="BacklogTile">
            <span className="TileTitle">{data.name}</span>
            <span className="TileInfo">{`Effort: ${data.effort}`}</span>
            <div className="TileTags">
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
        </div>
    );
}

export const TaskTile = ({ data }) => {
    return (
        <div className="TaskTile">
            <span className="TileTitle">{data.name}</span>
            <span className="TileInfo">{`Całkowity czas: ${data.plannedTime}`}</span>
            <span className="TileInfo">{`Czas dotychczas spędzony: ${data.spentTime}`}</span>
            <span className="TileInfo">{`Wykonawca: ${data.person}`}</span>
            <div className="TileTags">
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
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

export const Table = () => {
    let id = "5ec9ab3e19bfd005384958f3";

    const [sprint, setSprint] = useState(undefined);

    // let sprint = { // data mock, to remove later
    //     number: 1,
    //     start: '1.01.01',
    //     end: '2.02.02',
    //     backlogs: [
    //         {
    //             title: 'Pierwszy',
    //             effort: 3,
    //             tags: ['RTT', 'new'],
    //             tasks: [
    //                 {
    //                     title: 'Task 1',
    //                     plannedTime: 6,
    //                     spentTime: 3,
    //                     person: 'John Doe',
    //                     tags: ['RTT'],
    //                     status: 'ToDo'
    //                 },
    //                 {
    //                     title: 'Task 2',
    //                     plannedTime: 6,
    //                     spentTime: 3,
    //                     person: 'John Doe',
    //                     tags: ['RTT'],
    //                     status: 'Done'
    //                 }
    //             ]
    //         },
    //         {
    //             title: 'Drugi',
    //             effort: 3,
    //             tags: ['RTT', 'new'],
    //             tasks: [
    //                 {
    //                     title: 'Task 3',
    //                     plannedTime: 6,
    //                     spentTime: 3,
    //                     person: 'John Doe',
    //                     tags: ['RTT'],
    //                     status: 'InProgress'
    //                 },
    //                 {
    //                     title: 'Task 4',
    //                     plannedTime: 6,
    //                     spentTime: 3,
    //                     person: 'John Doe',
    //                     tags: ['RTT'],
    //                     status: 'Done'
    //                 }
    //             ]
    //         }
    //     ]
    // };

    useEffect(() => {
        axios.get('/sprintForTeam/'+id).then(
            (res) => {
                setSprint(res.data);
            }
        )
    }, []);

    if(typeof sprint === 'undefined') {
        return (
            <div className="TableHeader">Poczekaj chwilę</div>
        );
    }

    return (
        <div className="Table">
            <div className="TableHeader">{`Sprint ${sprint.number}: ${sprint.start}-${sprint.end}`}</div>
            {sprint.backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}