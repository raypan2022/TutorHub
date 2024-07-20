import { useState } from 'react';
import Router from 'next/router';
import {
  Levels,
  Classes,
  HighSchoolSubjects,
  UniversitySubjects,
} from '@raypan2022-tickets/common';
import useRequest from '../hooks/use-request';
import styles from './SubjectSelect.module.css';

export default ({}) => {
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  const [subjectSelections, setSubjectSelections] = useState([
    ...Object.values(HighSchoolSubjects).map((subject) => ({
      subject,
      selected: false,
      price: '',
      level: Levels.HighSchool,
    })),
    ...Object.values(UniversitySubjects).map((subject) => ({
      subject,
      selected: false,
      price: '',
      level: Levels.University,
    })),
  ]);

  const handleCardClick = (subject) => {
    setSubjectSelections((prev) => {
      return prev.map((selection) => {
        if (selection.subject === subject) {
          return { ...selection, selected: !selection.selected, price: '' };
        }
        return selection;
      });
    });
  };

  const handleRemoveSelection = (subject) => {
    setSubjectSelections((prev) => {
      return prev.map((selection) => {
        if (selection.subject === subject) {
          return { ...selection, selected: false, price: '' };
        }
        return selection;
      });
    });
  };

  const handlePriceChange = (subject, newPrice) => {
    setSubjectSelections((prev) =>
      prev.map((selection) =>
        selection.subject === subject
          ? { ...selection, price: newPrice }
          : selection
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedSubjects = subjectSelections
      .filter((selection) => selection.selected)
      .map((selection) => ({
        title: selection.subject,
        price: selection.price,
        subject: selection.subject,
        level: selection.level,
      }));

    doRequest({ tickets: selectedSubjects });
  };

  const onBlur = (subject, price) => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      handlePriceChange(subject, '');
      return;
    }

    handlePriceChange(subject, value.toFixed(2));
  };

  const options = Object.entries(Levels).map(([key, value]) => {
    return (
      <div key={key} className="">
        <h3>{value}</h3>
        <hr className="mb-3" />
        <div className="d-flex flex-wrap gap-3">
          {Object.keys(Classes[value])?.length > 0 &&
            Object.values(Classes[value]).map((subject) => (
              <div
                key={subject}
                className={`card ${styles['custom-card']} ${
                  subjectSelections.find(
                    (selection) => selection.subject === subject
                  )?.selected
                    ? styles['selected']
                    : ''
                }`}
                onClick={() => handleCardClick(subject)}
              >
                <h5 className="card-title h-50">{subject}</h5>
              </div>
            ))}
        </div>
      </div>
    );
  });

  const selectedCards = subjectSelections
    .filter((selection) => selection.selected)
    .map((selection) => {
      return (
        <div className="card mb-2 card-custom" key={selection.subject}>
          <div className="card-body position-relative">
            <button
              type="button"
              className={`btn-close position-absolute ${styles['close-button']}`}
              aria-label="Close"
              onClick={() => handleRemoveSelection(selection.subject)}
            ></button>
            <h5 className="card-title">{selection.subject}</h5>
            <div className="input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                className="form-control"
                value={selection.price}
                placeholder="Your Charge Rate (per hour)"
                onBlur={(event) => {
                  onBlur(selection.subject, event.target.value);
                }}
                onChange={(event) => {
                  handlePriceChange(selection.subject, event.target.value);
                }}
                aria-label="Amount (to the nearest cent)"
              />
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className="container pb-5">
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="row g-5">
          <div className="col d-flex flex-column gap-5">{options}</div>
          <div className="col-5">
            <h3>My Selections</h3>
            <hr className="mb-3" />
            {errors}
            {selectedCards}
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles['submit-button']} ${
            subjectSelections.some((selection) => selection.selected)
              ? styles['enabled']
              : ''
          }`}
          disabled={!subjectSelections.some((selection) => selection.selected)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
