import React, { useEffect, useState } from 'react';
import StudentsTable from './StudentsTable';
import { useStudents } from '../data/students';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';
import StudentForm from './StudentForm';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function StudentsPage () {
  const {
    loadingStudents,
    studentList,
    fetchStudentsError,
    fetchStudentList,
    createStudent,
    deleteSingleStudent,
    submittingStudent,
    submitStudentError
  } = useStudents();

  useEffect(fetchStudentList, []);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  const destroyStudent = async (id) => {
    setAlertOpen(false);
    setAlertMessage('');
    try {
      await deleteSingleStudent(id);
      setAlertSeverity('success');
      setAlertMessage("l'élève a bien été supprimé de l'API");
    } catch (e) {
      setAlertMessage("l'élève n'a pas pu être supprimé de l'API");
      setAlertSeverity('error');
    } finally {
      setAlertOpen(true);
    }
  };

  return (
    <div>
      <h2>Liste des étudiants</h2>
      {loadingStudents ? <LoadingIndicator />
        : (fetchStudentsError ? <ErrorBox message={fetchStudentsError} />
          : (studentList.length
            ? <StudentsTable destroyStudent={destroyStudent} students={studentList} />
            : <p>Il n'y a aucun étudiant sur l'API</p>
          )
        )}
      {!loadingStudents &&
        <StudentForm
          onSubmit={createStudent}
          submittingStudent={submittingStudent}
          submitStudentError={submitStudentError}
        />}
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default StudentsPage;
