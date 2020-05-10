import React from 'react';
import './App.css';
import axios from 'axios';
import { orderBy, get } from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
const newTaskDefaultAttributes = {
  name: '',
  done: false,
  _submitting: false
};

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingTasks: false,
      taskList: [],
      newTask: { ...newTaskDefaultAttributes },
      alertMessage: '',
      alertSeverity: '',
      alertOpen: false
    };
    this.newTaskNameInputRef = React.createRef();
  }

  componentDidMount () {
    this.fetchTasks();
    this.newTaskNameInputRef.current.focus();
  }

  showSuccessMessage = alertMessage => this.setState({ alertOpen: true, alertMessage, alertSeverity: 'success' })
  showErrorMessage = alertMessage => this.setState({ alertOpen: true, alertMessage, alertSeverity: 'error' })
  closeAlert = () => this.setState({ alertOpen: false })
  updateNewTaskAttributes = (newAttributes) => {
    this.setState({ newTask: { ...this.state.newTask, ...newAttributes } });
  }

  updateTaskLocally = (id, newAttributes) => {
    this.setState({
      taskList: this.state.taskList.map(task => task.id === id ? { ...task, ...newAttributes } : task)
    });
  }

  handleCreateTaskEvent = event => {
    event.preventDefault();
    const { newTask } = this.state;
    if (newTask.name !== '') {
      this.createTask();
    } else {
      this.showErrorMessage('You must give a name to this new task !');
    }
  }

  fetchTasks = () => {
    this.setState({ loadingTasks: true });
    axios.get('http://localhost:5000/tasks')
      .then(res => res.data)
      .then(taskList => this.setState({ taskList }))
      .catch(() => {
        this.showErrorMessage("Can't load tasks form the server");
      })
      .finally(() => {
        this.setState({ loadingTasks: false });
      });
  }

  createTask = () => {
    this.setState({ newTask: { ...this.state.newTask, _submitting: true } });
    const { newTask: { name, done } } = this.state;
    axios.post('http://localhost:5000/tasks', { name, done })
      .then(res => res.data)
      .then(newTask => {
        this.setState({ taskList: [...this.state.taskList, newTask], newTask: { ...newTaskDefaultAttributes } });
        this.showSuccessMessage(`Task "${name}" successfully created on the server !`);
      })
      .catch(error => {
        if (get(error, 'response.data.errorMessage')) {
          this.showErrorMessage(get(error, 'response.data.errorMessage'));
        } else {
          this.showErrorMessage(`Can't create task "${name}" on server`);
        }
      })
      .finally(() => {
        this.setState({ newTask: { ...this.state.newTask, _submitting: false } });
      });
  }

  updateTask = (id, done) => {
    this.updateTaskLocally(id, { _updating: true });
    axios.patch('http://localhost:5000/tasks/' + id, { done })
      .then(res => res.data)
      .then(updatedTask => {
        this.updateTaskLocally(id, updatedTask);
        const taskName = this.state.taskList.find(t => t.id === id).name;
        this.showSuccessMessage(`Task "${taskName}" successfully updated on the server !`);
      })
      .catch(error => {
        if (get(error, 'response.status') === 404) {
          this.setState({ taskList: this.state.taskList.filter(t => t.id !== id) });
          this.showErrorMessage('This task does not exist on the server');
        } else {
          this.showErrorMessage('Can\'t update this task on server');
        }
      })
      .finally(() => {
        this.updateTaskLocally(id, { _updating: false });
      });
  }

  deleteTask = id => {
    this.updateTaskLocally(id, { _deleting: true });
    axios.delete('http://localhost:5000/tasks/' + id)
      .then(() => {
        this.setState({ taskList: this.state.taskList.filter(t => t.id !== id) });
        this.showSuccessMessage('Task successfully deleted !');
      })
      .catch(error => {
        if (get(error, 'response.status') === 404) {
          this.setState({ taskList: this.state.taskList.filter(t => t.id !== id) });
          this.showErrorMessage('This task did not exist on the server but has been removed from the list anyway.');
        } else {
          this.showErrorMessage('Can\'t delete this task on server');
        }
        this.updateTaskLocally(id, { _deleting: false });
      });
  }

  render () {
    const { taskList, loadingTasks, newTask, alertMessage, alertOpen, alertSeverity } = this.state;
    const { updateTask, deleteTask, updateNewTaskAttributes, closeAlert, handleCreateTaskEvent } = this;
    return (
      <main className='app'>
        <h1>To do</h1>
        <TableContainer component={Paper} className='task-table-container'>
          <Table aria-label='task table'>
            <TableBody>
              <TableRow className={'task-row' + (newTask._submitting ? ' processing' : '')}>
                <TableCell className='check-task-cell'>
                  <Checkbox
                    checked={newTask.done}
                    onChange={event => {
                      updateNewTaskAttributes({ done: event.target.checked });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <form onSubmit={handleCreateTaskEvent}>
                    <input
                      ref={this.newTaskNameInputRef}
                      className='new-task-name-input'
                      id='new-task-name'
                      placeholder='New task name'
                      value={newTask._submitting ? `Submitting task "${newTask.name}..."` : newTask.name}
                      onChange={(event) => {
                        updateNewTaskAttributes({ name: event.target.value });
                      }}
                    />
                  </form>
                </TableCell>
                <TableCell align='right'>
                  <AddCircleOutlineIcon
                    className={'task-action-btn' + (newTask.name === '' ? ' disabled' : '')}
                    onClick={handleCreateTaskEvent}
                  />
                </TableCell>
              </TableRow>
              {loadingTasks
                ? <TableRow><TableCell colSpan={3} align='center'><CircularProgress /></TableCell></TableRow>
                : orderBy(taskList, ['createdAt'], ['desc']).map(t => {
                  const processing = t._updating || t._deleting;
                  const formattedName = capitalizeFirstLetter(t.name);
                  let taskNameFieldValue = formattedName;
                  if (t._updating) { taskNameFieldValue = `Updating task "${formattedName}" on the server...`; }
                  if (t._deleting) { taskNameFieldValue = `Deleting task "${formattedName}" on the server...`; }
                  const createdAtMoment = moment(t.createdAt);
                  const hoverMessage = `Created ${createdAtMoment.fromNow()}`;

                  return (
                    <TableRow className={'task-row' + (processing ? ' processing' : '')} key={t.id}>
                      <TableCell className='check-task-cell'>
                        <Checkbox
                          checked={t.done}
                          onChange={(event) => updateTask(t.id, event.target.checked)}
                        />
                      </TableCell>
                      <TableCell><p title={hoverMessage}>{taskNameFieldValue}</p></TableCell>
                      <TableCell align='right'>
                        <DeleteForeverIcon className='task-action-btn' onClick={() => deleteTask(t.id)} />
                      </TableCell>
                    </TableRow>
                  );
                }
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar open={alertOpen} autoHideDuration={3000} onClose={closeAlert}>
          <Alert onClose={closeAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </main>
    );
  }
}

export default App;
