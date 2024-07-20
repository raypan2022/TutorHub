import Link from 'next/link';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import styles from './TutorCard.module.css';

const TutorCard = ({ lesson }) => {
  const { setCurLesson } = useContext(AppContext);

  return (
    <Link
      className={`card ${styles.tutorCard}`}
      href="/subjects/lesson/[lessonId]"
      as={`/subjects/lesson/${lesson.id}`}
      style={{ textDecoration: 'none' }}
      onClick={() => setCurLesson(lesson)}
    >
      <img
        src={
          lesson.user.image ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        }
        className={`card-img-top ${styles.cardImage}`}
        alt={lesson.user.name}
      />
      <div className="card-body">
        <h5 className="card-title">{lesson.user.name}</h5>
        <p className="card-text">Online</p>
        <p className="card-text fw-bold">${lesson.price}/h</p>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <div>
          <span className="text-warning">
            ★ <span className="text-dark">{lesson.rating || 'new'}</span>
          </span>
          <span className="text-muted"> {lesson.reviews} </span>
        </div>
        <span className={`badge ${styles.ambassadorBadge}`}>Top Tutor</span>
      </div>
    </Link>
  );
};

export default TutorCard;
