import Router, { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import styles from './BackButton.module.css';

export default () => {
  const router = useRouter();
  
  if (router.pathname === '/') {
    return null;
  }

  const onClick = () => {
    if (router.pathname === '/auth/profile') {
      Router.push('/');
      return;
    }
    router.back();
  };

  return (
    <button
      type="button"
      className={`btn ${styles['back-button']}`}
      onClick={() => onClick()}
    >
      <i className="bi bi-chevron-left"></i> Back
    </button>
  );
};
