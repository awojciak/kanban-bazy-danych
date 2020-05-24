import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import '../css/App.css';
import { Table } from './modules/Table';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path={'/'}>
            <Table />
          </Route>
          <Route path={'/ss'}>
            <div>test</div>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
