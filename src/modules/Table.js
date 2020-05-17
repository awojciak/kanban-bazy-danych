import React from 'react';

export const Tag = ({ name }) => (
    <div className="Tag">{name}</div>
)

export const BacklogTile = () => {
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
                <BacklogTile />
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
            <div className="BacklogCol">
                {data.tasks.filter((task) => task.status === 'ToDo').map(<TaskTile data={task} />)}
            </div>
        </div>
    );
}

export const Table = () => {
    const backlogs = [];
    return (
        <div className="Table">
            {backlogs.map((backlog) => <BacklogRow data={backlog} />)}
        </div>
    );
}