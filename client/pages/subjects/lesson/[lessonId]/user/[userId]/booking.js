import React, { useState, useRef, useEffect } from 'react';
import Router from 'next/router';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import useRequest from '../../../../../../hooks/use-request';

const Booking = ({ lesson, event, username, serverErrors }) => {
  const [isScheduled, setIsScheduled] = useState(false);
  const checkoutRef = useRef(null);

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      lessonId: lesson.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      console.log('Event Scheduled:', e.data.payload);
      setIsScheduled(true);
    },
  });

  useEffect(() => {
    if (isScheduled && checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isScheduled]);

  if (serverErrors) {
    return serverErrors;
  }

  return (
    <div>
      <h1>Book Your Lesson with {username}</h1>
      <InlineWidget url={event.resource.scheduling_url} styles={{ minWidth: '320px', height: '700px' }} />
      
      {isScheduled && (
        <div ref={checkoutRef} className="text-center mt-4">
          <h2>Continue to Checkout</h2>
          <div>
            <h1>{lesson.title}</h1>
            <h4>Price: {lesson.price}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary mt-3">
              Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Booking.getInitialProps = async (context, client) => {
  const { lessonId, userId } = context.query;

  try {
    const eventResponse = await client.get(`/api/users/calendly/event-type`, {
      params: { userId },
    });

    const lessonResponse = await client.get(`/api/tickets/lesson/${lessonId}`);

    return {
      lesson: lessonResponse.data,
      event: eventResponse.data.event,
      username: eventResponse.data.username,
    };
  } catch (error) {
    const serverErrors = (
      <div className="alert alert-danger">
        <h4>Ooops....</h4>
        <ul className="my-0">
          {error.response.data.errors.map((err) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
    return {
      serverErrors,
    };
  }
};

export default Booking;
