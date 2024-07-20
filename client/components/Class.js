import Link from 'next/link';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import styles from './Class.module.css';

export default ({ subject }) => {
  // const { setCurSubject } = useContext(AppContext);

  return (
    <Link
      href="/subjects/[subject]"
      as={`/subjects/${subject}`}
      className=""
      style={{ textDecoration: 'none' }}
      // onClick={() => setCurSubject(subject)}
    >
      <div className={`card ${styles['custom-card']}`}>
        <h5 className="card-title h-50">{subject}</h5>
      </div>
    </Link>
  );
};
