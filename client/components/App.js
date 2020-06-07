import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import '../css/App.css';
import { Table } from './modules/Table';
import { ChooseTabForm, SearchTasksModal, SearchBacklogsModal, AddSprintModalForm, AddTeamModalForm, AddPersonModalForm } from './modules/Forms'
import axios from 'axios';

function App() {
  const [tabId, setTabId] = useState(null);

  const chooseCb = (sprintId, teamId) => {
    console.log(sprintId);
    axios.get(`/getTabId/${sprintId}/${teamId}`).then(
      (res) => {
        setTabId(res.data.tabId);
      }
    );
  }

  const [sprints, setSprints] = useState([]);
  let [teams, setTeams] = useState([]);
  const [tagsSearchModalOpen, setTagsSearchModalOpen] = useState(false);
  const [backlogsSearchModalOpen, setBacklogsSearchModalOpen] = useState(false);
  const [newSprintModalOpen, setNewSprintModalOpen] = useState(false);
  const [newTeamModalOpen, setNewTeamModalOpen] = useState(false);
  const [newPersonModalOpen, setNewPersonModalOpen] = useState(false);

  useEffect(() => {
    axios.get('/getChooseFormData').then(
      (res) => {
        setSprints(res.data.sprints),
        setTeams(res.data.teams)
      }
    );
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path={'/'}>
            <button onClick={() => setTagsSearchModalOpen(true)}>Wyszukaj taski po tagach</button>
            <SearchTasksModal isOpen={tagsSearchModalOpen} closeCb={() => setTagsSearchModalOpen(false)} />

            <button onClick={() => setBacklogsSearchModalOpen(true)}>Wyszukaj backlogi po tagach</button>
            <SearchBacklogsModal isOpen={backlogsSearchModalOpen} closeCb={() => setBacklogsSearchModalOpen(false)} />

            <button onClick={() => setNewSprintModalOpen(true)}>Nowy sprint</button>
            <AddSprintModalForm isOpen={newSprintModalOpen} closeCb={() => setNewSprintModalOpen(false)} />

            <button onClick={() => setNewTeamModalOpen(true)}>Nowy zespół</button>
            <AddTeamModalForm isOpen={newTeamModalOpen} closeCb={() => setNewTeamModalOpen(false)} />

            <button onClick={() => setNewPersonModalOpen(true)}>Nowy pracownik</button>

            {sprints.length > 0 && teams.length > 0
              && (
                <>
                  <AddPersonModalForm isOpen={newPersonModalOpen} closeCb={() => setNewPersonModalOpen(false)} teams={teams} />
                  <ChooseTabForm sprints={sprints} teams={teams} callback={chooseCb}/>
                </>
              )
            }
            {(tabId !== null) 
              ? (
                <Table id={tabId} />
              ) : (
                <div className="TableHeader">
                  Wybierz sprint za pomocą formularza
                </div>
            )}
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
