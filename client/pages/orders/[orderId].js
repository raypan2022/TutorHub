import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import 'bootstrap/dist/css/bootstrap.css';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div className="alert alert-danger">Order Expired</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Order Details</h1>
              <h5 className="card-subtitle mb-2 text-muted">Time left to pay: {timeLeft} seconds</h5>
              <div className="mt-3">
                <h4>Ticket Title: {order.ticket.title}</h4>
                <h4>Price: ${order.ticket.price}</h4>
                <h4>Expires At: {new Date(order.expiresAt).toLocaleString()}</h4>
              </div>
              <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51PSB3zBx4qkznw3iKF8JPJiQowfTrV8HJDZnMKDzozcV9lr0wWNfp7hN57xLH948Daw962IbQogfJ3ateu0IIku100Hc1vnUEy"
                amount={order.ticket.price * 100}
                email={currentUser.email}
              />
              {errors && <div className="alert alert-danger mt-3">{errors}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
