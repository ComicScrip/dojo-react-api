import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash';

const LinkTd = ({ to, children }) => <td><Link to={to}>{children}</Link></td>;

const StudentsTableRow = ({ firstName, lastName, p1bisPresented, githubUserName, handleDelete, deleting }) => {
  const studentDetailsPageLink = '/students/' + githubUserName;
  return (
    <tr>
      <LinkTd to={studentDetailsPageLink}>{firstName}</LinkTd>
      <LinkTd to={studentDetailsPageLink}>{lastName.toUpperCase()}</LinkTd>
      <td>{p1bisPresented ? 'Oui' : 'Pas encore'}</td>
      <td style={{ width: 200 }}>
        <button disabled={deleting} className='student-row-del-btn' onClick={handleDelete}>
          {deleting ? 'Suppression en cours' : 'Supprimer'}
        </button>
      </td>
    </tr>
  );
};

const SortButton = ({ fieldToSortBy, sortOrder, activeSort, onClick }) => {
  const fieldToSortByWithOrder = fieldToSortBy + ' ' + sortOrder;
  return (
    <span
      className={'sort-button' + (activeSort === fieldToSortByWithOrder ? ' active' : '')}
      onClick={() => { onClick(fieldToSortByWithOrder); }}
    >
      <i className={'fas fa-arrow-' + (sortOrder === 'DESC' ? 'up' : 'down')} />
    </span>
  );
};

function StudentsTable ({ students, destroyStudent, deletingSingleStudent }) {
  const [activeSort, setActiveSort] = useState('');
  const [sortedStudents, setSortedStudents] = useState(students);
  const sortStudents = fieldToSortByWithOrder => {
    setActiveSort(activeSort === fieldToSortByWithOrder ? '' : fieldToSortByWithOrder);
  };
  const handleSortButtonClicked = fieldToSortByWithOrder => sortStudents(fieldToSortByWithOrder);
  useEffect(() => {
    let sorted = students.slice();
    const [fieldToSortBy, sortOrder] = activeSort.split(' ');

    if (fieldToSortBy) {
      sorted = sortBy(students, fieldToSortBy);
      if (sortOrder === 'DESC') {
        sorted = sorted.reverse();
      }
    }
    setSortedStudents(sorted);
  }, [students, activeSort]);

  return (
    <table>
      <thead>
        <tr>
          <td>Prénom
            <span className='col-sort-buttons-container'>
              <SortButton fieldToSortBy='firstName' sortOrder='ASC' onClick={handleSortButtonClicked} activeSort={activeSort} />
              <SortButton fieldToSortBy='firstName' sortOrder='DESC' onClick={handleSortButtonClicked} activeSort={activeSort} />
            </span>
          </td>
          <td>Nom
            <span className='col-sort-buttons-container'>
              <SortButton fieldToSortBy='lastName' sortOrder='ASC' onClick={handleSortButtonClicked} activeSort={activeSort} />
              <SortButton fieldToSortBy='lastName' sortOrder='DESC' onClick={handleSortButtonClicked} activeSort={activeSort} />
            </span>
          </td>
          <td>P1bis présenté</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {sortedStudents.map(s =>
          <StudentsTableRow
            key={s.githubUserName}
            firstName={s.firstName}
            lastName={s.lastName}
            githubUserName={s.githubUserName}
            p1bisPresented={s.p1bisPresented}
            handleDelete={() => { destroyStudent(s.githubUserName); }}
            deleting={s._deleting}
          />
        )}
      </tbody>
    </table>
  );
}

export default StudentsTable;
