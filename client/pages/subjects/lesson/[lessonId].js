// import { useContext } from 'react';
// import Router from 'next/router';
import Link from 'next/link';

// import AppContext from '../../../context/AppContext';
// import useRequest from '../../../hooks/use-request';

const Lesson = ({ curLesson }) => {
  // const { doRequest, errors } = useRequest({
  //   url: '/api/orders',
  //   method: 'post',
  //   body: {
  //     lessonId: curLesson.id,
  //   },
  //   onSuccess: (order) =>
  //     Router.push('/orders/[orderId]', `/orders/${order.id}`),
  // });

  return (
    <div className="container mt-5">
      <div className="row h-100">
        <div className="col-md-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="card-title">{curLesson.user.name}</h2>
              <h4 className="card-subtitle mb-2 text-muted">
                About the teacher
              </h4>
              <p className="card-text">{curLesson.user.description}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body">
              <h1 className="card-title">{curLesson.title}</h1>
              <h4 className="card-subtitle mb-2 text-muted">
                Price: ${curLesson.price}
              </h4>
              <Link
                className="btn btn-primary mt-3"
                href="/subjects/lesson/[lessonId]/user/[userId]/booking"
                as={`/subjects/lesson/${curLesson.id}/user/${curLesson.user.id}/booking`}
              >
                Schedule a Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Lesson.getInitialProps = async (context, client) => {
  const { lessonId } = context.query;

  const { data } = await client.get(`/api/tickets/lesson/${lessonId}`);

  return { curLesson: data };
};

export default Lesson;
