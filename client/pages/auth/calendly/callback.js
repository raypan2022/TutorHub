import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';

import useRequest from '../../../hooks/use-request';

const CalendlyCallback = ({}) => {
  const router = useRouter();
  const { code } = router.query;

  const { doRequest, errors } = useRequest({
    url: `/api/users/calendly/callback?code=${code}`,
    method: 'get',
    onSuccess: () => {
      Router.push('/auth/profile');
    },
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>{errors}</div>;
};

export default CalendlyCallback;
