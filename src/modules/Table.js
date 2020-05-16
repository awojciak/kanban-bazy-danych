import React from 'react';

const Tag = ({ name }) => (
    <div>{name}</div>
)

const BacklogTile = () => {
    return (
        <div>
            <span>{data.title}</span>
            <span>{`Effort: ${data.effort}`}</span>
            <div>
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
        </div>
    );
}

const TaskTile = ({ data }) => {
    return (
        <div>
            <span>{data.title}</span>
            <span>{`Całkowity czas: ${data.fullTime}`}</span>
            <span>{`Czas dotychczas spędzony: ${data.usedTime}`}</span>
            <span>{`Wykonawca: ${data.person}`}</span>
            <div>
                {data.tags.map((tag) => <Tag name={tag} />)}
            </div>
        </div>
    )
}

const BacklogRow = ({ data }) => {
    return (
        <div>
            <div>
                <BacklogTile />
            </div>
            <div>
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
            <div>
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
            <div>
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
        </div>
    );
}

const Table = () => {
    const backlogs = [];
    return (
        <div>
            {backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}