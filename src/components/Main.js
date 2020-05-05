import React from 'react';
import HomePage from './Home';
import {
  Switch,
  Route
} from 'react-router-dom';
import StudentsPage from './StudentsPage';
import StudentDetailsPage from './StudentDetailsPage';

function Main () {
  return (
    <main>
      <Switch>
        <Route exact path='/students'>
          <StudentsPage />
        </Route>
        <Route exact path='/students/:githubAccountName'>
          {props => <StudentDetailsPage {...props} />}
        </Route>
        <Route exact path='/'>
          <HomePage />
        </Route>
      </Switch>
    </main>
  );
}
export default Main;
