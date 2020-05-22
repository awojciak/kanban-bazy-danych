import React from 'react';
import '../../css/App.css';

export const Tag = ({ name }) => (
    <div className="Tag">{name}</div>
)

export const BacklogTile = ({ data }) => {
    return (
        <div className="BacklogTile">
            <span className="TileTitle">{data.title}</span>
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
            <span className="TileTitle">{data.title}</span>
            <span className="TileInfo">{`Całkowity czas: ${data.fullTime}`}</span>
            <span className="TileInfo">{`Czas dotychczas spędzony: ${data.usedTime}`}</span>
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
    const sprint = { // data mock, to remove later
        number: 1,
        from: '1.01.01',
        to: '2.02.02',
        backlogs: [
            {
                title: 'Pierwszy',
                effort: 3,
                tags: ['RTT', 'new'],
                tasks: [
                    {
                        title: 'Task 1',
                        fullTime: 6,
                        usedTime: 3,
                        person: 'John Doe',
                        tags: ['RTT'],
                        status: 'ToDo'
                    },
                    {
                        title: 'Task 2',
                        fullTime: 6,
                        usedTime: 3,
                        person: 'John Doe',
                        tags: ['RTT'],
                        status: 'Done'
                    }
                ]
            },
            {
                title: 'Drugi',
                effort: 3,
                tags: ['RTT', 'new'],
                tasks: [
                    {
                        title: 'Task 3',
                        fullTime: 6,
                        usedTime: 3,
                        person: 'John Doe',
                        tags: ['RTT'],
                        status: 'InProgress'
                    },
                    {
                        title: 'Task 4',
                        fullTime: 6,
                        usedTime: 3,
                        person: 'John Doe',
                        tags: ['RTT'],
                        status: 'Done'
                    }
                ]
            }
        ]
    };

    return (
        <div className="Table">
            <div className="TableHeader">{`Sprint ${sprint.number}: ${sprint.from}-${sprint.to}`}</div>
            {sprint.backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}