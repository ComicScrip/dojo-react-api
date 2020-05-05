import React, { useState } from 'react';
import ErrorBox from './ErrorBox';

const Field = ({ label, inputProps }) =>
  <div className='field'>
    <label htmlFor={inputProps.name}>{label} : </label>
    <input {...inputProps} id={inputProps.name} />
  </div>;

const StudentForm = ({ onSubmit, submittingStudent, submitStudentError }) => {
  const handleFieldChange = (fieldName, value) => setFields(prevFields => prevFields.map(f =>
    f.input.name === fieldName ? { ...f, input: { ...f.input, value } } : f
  ));
  const createFieldChangeHandler = fieldName => event => handleFieldChange(fieldName, event.target.value);

  const [fields, setFields] = useState([
    {
      label: 'Nom',
      input: {
        name: 'firstName',
        value: '',
        onChange: createFieldChangeHandler('firstName'),
        type: 'text',
        required: true
      }
    },
    {
      label: 'Prénom',
      input: {
        name: 'lastName',
        value: '',
        onChange: createFieldChangeHandler('lastName'),
        type: 'text',
        required: true
      }
    },
    {
      label: 'URL Github',
      input: {
        name: 'githubAccountUrl',
        value: '',
        onChange: createFieldChangeHandler('githubAccountUrl'),
        type: 'url',
        required: true
      }
    }
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formValues = {};
    fields.forEach(f => { formValues[f.input.name] = f.input.value; });
    onSubmit(formValues);
  };

  return (
    <form className='student-form' onSubmit={handleSubmit} aria-disabled={submittingStudent}>
      <h2>Ajouter un étudiant</h2>
      {fields.map(f => <Field label={f.label} inputProps={f.input} key={f.input.name} />)}
      <input type='submit' disabled={submittingStudent} value={submittingStudent ? 'Ajout en cours...' : 'Ajouter'} />
      {submitStudentError && <ErrorBox message={submitStudentError} />}
    </form>
  );
};

export default StudentForm;
