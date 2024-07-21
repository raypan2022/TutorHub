import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { AppProvider } from '../context/AppContext';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <AppProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header currentUser={currentUser} />
        <BackButton />
        <div className="container py-4" style={{ flex: '1' }}>
          <Component currentUser={currentUser} {...pageProps} />
        </div>
        <footer style={{ marginTop: 'auto' }} className="bg-body-tertiary text-center text-lg-start">
          <div className="text-center p-3">
            © 2024 Copyright: TutorHub
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
