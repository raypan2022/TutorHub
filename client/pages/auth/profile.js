import { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

const Profile = ({
  currentUser,
  isConnected,
  hasEvent,
  events,
  serverErrors,
}) => {
  if (!currentUser) {
    return (
      <div className="alert alert-warning">
        <h4>Please sign in or sign up first</h4>
        <p>
          <Link href="/auth/signin">
            Sign In
          </Link>{' '}
          or{' '}
          <Link href="/auth/signup">
            Sign Up
          </Link>
        </p>
      </div>
    );
  }

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.description);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [editMode, setEditMode] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/users/update',
    method: 'post',
    body: {
      name,
      description,
      ...(selectedEvent && { eventuuid: selectedEvent }),
    },
    onSuccess: () => {
      setEditMode(false);
      if (selectedEvent) {
        setFeedback('Calendar connected successfully');
        setTimeout(() => setFeedback(''), 3000);
      }
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const handleEventSelection = (eventUri) => {
    setSelectedEvent(eventUri);
  };

  const handleConfirmClick = async () => {
    if (selectedEvent) {
      await doRequest();
    }
  };

  const handleConnectCalendly = () => {
    const clientId = 'jC79H2W2OI_1geNZX1Kz5osV4rMuaQOoNa0yEqDkCqo';
    const redirectUri = 'http://tutorhubapp.ca/auth/calendly/callback';

    const authorizationUrl = `https://auth.calendly.com/oauth/authorize?response_type=code&client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    Router.push(authorizationUrl);
  };

  return (
    <div className="container d-flex flex-column gap-3">
      <h1>Your Profile</h1>
      {!editMode ? (
        <div>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <div>
            {' '}
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          </div>
          <h2 className="mt-5">
            Finish Setting Up Your Account To Enable Online Bookings
          </h2>
          <div className="mt-4">
            <h4>Step 1: Log in to your Calendly account</h4>
            <button
              className="btn btn-primary mt-3"
              style={{ borderRadius: '10px' }}
              onClick={() => handleConnectCalendly()}
              disabled={isConnected}
            >
              {isConnected ? 'Connected to Calendly' : 'Connect to Calendly'}
            </button>
          </div>
          <div className="mt-4">
            <h4 style={{ color: isConnected ? 'black' : 'grey' }}>
              Step 2: Pick one of your calendars to use as your TutorHub
              calendar
            </h4>
            {hasEvent && (
              <p>
                You have already selected a calendar, but you can edit it below
              </p>
            )}
            {isConnected && (
              <div>
                <ul>
                  {events.map((event) => (
                    <li key={event.uri}>
                      <input
                        type="radio"
                        id={event.uri}
                        name="selectedEvent"
                        value={event.uri}
                        onChange={() => handleEventSelection(event.uri)}
                      />
                      <label className="ms-2" htmlFor={event.uri}>
                        {event.name}
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-success"
                  style={{ borderRadius: '10px' }}
                  onClick={handleConfirmClick}
                  disabled={!selectedEvent}
                >
                  Confirm Selection
                </button>
                <p className="mt-2">{feedback}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h4 style={{ color: hasEvent ? 'black' : 'grey' }}>
              Step 3: Pick your classes
            </h4>
            {hasEvent && currentUser && (
              <div className="mt-4">
                <Link className="btn btn-success" href="/tickets/new">
                  Go to subject selection page
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ maxWidth: '200px', marginRight: '10px' }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ maxWidth: '200px' }}
              onClick={() => {
                setEditMode(false);
                setName(currentUser.name);
                setDescription(currentUser.description);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {errors}
      {/* {serverErrors} */}
    </div>
  );
};

Profile.getInitialProps = async (context, client) => {
  try {
    const statusResponse = await client.get(`/api/users/calendly/status`);

    const typeResponse = await client.get('/api/users/calendly/event-types');

    return {
      isConnected: statusResponse.data.isConnected,
      hasEvent: statusResponse.data.hasEvent,
      events: typeResponse.data.collection,
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
      isConnected: false,
      hasEvent: false,
      events: [],
      serverErrors,
    };
  }
};

export default Profile;
