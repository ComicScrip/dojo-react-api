import React, { useEffect } from 'react';
import { useStudents } from '../data/students';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';

function StudentDetailsPage ({ match: { params: { githubAccountName } } }) {
  const { fetchSingleStudent, singleStudent, fetchSingleStudentError, loadingSingleStudent } = useStudents();
  useEffect(() => {
    fetchSingleStudent(githubAccountName);
  }, [fetchSingleStudent, githubAccountName]);

  if (loadingSingleStudent) return <LoadingIndicator />;
  if (fetchSingleStudentError) return <ErrorBox message={fetchSingleStudentError} />;
  if (singleStudent === null) return null;

  const { firstName, lastName, avatarUrl, fullName, githubAccountUrl, p1bisRepoUrl, p1bisPresented } = singleStudent;
  return (
    <div>
      <h2>Détails sur un élève</h2>

      <div className='student-card'>
        <a href={githubAccountUrl} target='_blank' rel='noopener noreferrer'>
          <img className='avatar' alt={fullName} src={avatarUrl} />
        </a>
        <br />
        <p>{firstName}</p>
        <p>{lastName.toUpperCase()}</p>
        <a className='p1-repo-link' href={p1bisRepoUrl}>P1bis Repo {p1bisPresented ? '✔' : ''}</a>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
