import { useState } from 'react';
import axios from 'axios';

class Student {
  constructor (props) {
    for (const key in props) {
      this[key] = props[key];
    }
  }

  static async loadAll () {
    return axios.get('http://localhost:3000/students').then(res => res.data);
  }

  static async loadOne (githubAccountName) {
    return axios.get(`http://localhost:3000/students/${githubAccountName}`).then(res => res.data);
  }

  static async destroy (githubAccountName) {
    return axios.delete(`http://localhost:3000/students/${githubAccountName}`);
  }

  static async create (attributes) {
    return axios.post('http://localhost:3000/students', attributes).then(res => res.data);
  }

  get githubUserName () {
    const accountUrlParts = this.githubAccountUrl.split('/');
    return accountUrlParts[accountUrlParts.length - 1];
  }

  get avatarUrl () {
    return `https://github.com/${this.githubUserName}.png`;
  }

  get fullName () {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const useStudents = () => {
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSingleStudent, setLoadingSingleStudent] = useState(false);
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [singleStudent, setSingleStudent] = useState(null);
  const [fetchStudentsError, setFetchStudentsError] = useState(null);
  const [submitStudentError, setSubmitStudentError] = useState(null);
  const [fetchSingleStudentError, setFetchSingleStudentError] = useState(null);
  const [deleteSingleStudentError, setDeleteSingleStudentError] = useState(null);

  const fetchStudentList = () => {
    setLoadingStudents(true);
    setFetchStudentsError(null);
    Student.loadAll()
      .then(studentList => {
        setStudentList(studentList.map(s => new Student(s)));
        setFetchStudentsError(null);
      }).catch(error => {
        console.error(error);
        setFetchStudentsError('Une erreur est survenue lors du chargement de la liste des élèves');
      }).finally(() => setLoadingStudents(false));
  };

  const fetchSingleStudent = (githubAccountName) => {
    setLoadingSingleStudent(true);
    setFetchSingleStudentError(null);
    Student.loadOne(githubAccountName)
      .then(student => {
        setSingleStudent(new Student(student));
        setFetchSingleStudentError(null);
      }).catch(({ response }) => {
        console.error(response);
        if (response && response.status === 404) {
          setFetchSingleStudentError(`Aucun élève avec l'identifiant "${githubAccountName}" n'a été trouvé sur le serveur`);
        } else {
          setFetchSingleStudentError('Une erreur est survenue lors du chargement de cet élève');
        }
      }).finally(() => setLoadingSingleStudent(false));
  };

  const setDeletingSingleStudent = (githubAccountName, deleting) => setStudentList(prevList => prevList.map(s =>
    s.githubUserName === githubAccountName ? new Student({ ...s, _deleting: deleting }) : s
  ));

  const deleteSingleStudent = (githubAccountName) => {
    setDeletingSingleStudent(githubAccountName, true);
    setDeleteSingleStudentError(null);
    return Student.destroy(githubAccountName)
      .then(() => {
        setStudentList(prevStudentList => prevStudentList.filter(s => s.githubUserName !== githubAccountName));
        setDeleteSingleStudentError(null);
      }).catch(({ response }) => {
        console.error(response);
        throw new Error(response);
      }).finally(() => setDeletingSingleStudent(githubAccountName, false));
  };

  const createStudent = (attributes) => {
    setSubmittingStudent(true);
    setSubmitStudentError(false);
    return Student.create(attributes).then(student => {
      setStudentList([...studentList, student].map(s => new Student(s)));
      setSubmitStudentError(null);
    }).catch(({ response }) => {
      console.error(response);
      if (response.data && response.data.error) {
        setSubmitStudentError('Erreur : ' + response.data.error);
      } else {
        setSubmitStudentError("Un problème est survenu lors de la création de l'étudiant sur le serveur");
      }
    }).finally(() => setSubmittingStudent(false));
  };

  return {
    loadingStudents,
    studentList,
    fetchStudentsError,
    loadingSingleStudent,
    singleStudent,
    fetchSingleStudentError,
    deleteSingleStudentError,
    submittingStudent,
    submitStudentError,
    fetchStudentList,
    fetchSingleStudent,
    createStudent,
    deleteSingleStudent
  };
};

export default Student;
