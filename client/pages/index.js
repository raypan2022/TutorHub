import { Levels, Classes } from '@raypan2022-tickets/common';
import Class from '../components/Class';

const LandingPage = ({ currentUser }) => {

  const levelList = Object.entries(Levels).map(([key, value]) => {
    return (
      <div key={key} className="">
        <h3>{value}</h3>
        <hr className="mb-3" />
        <div className='d-flex flex-wrap gap-3'>
          {Object.keys(Classes[value])?.length > 0 &&
            Object.values(Classes[value]).map((subject) => (
              <Class key={subject} subject={subject}/>
            ))}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h1 className=''>Classes</h1>
      <div className="d-flex flex-column gap-5 mt-5">{levelList}</div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  
};

export default LandingPage;
