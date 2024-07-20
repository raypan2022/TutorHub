import TutorCard from '../../components/TutorCard';

const Subject = ({ subject, lessons }) => {
  const lessonList = lessons.map((lesson) => {
    return (
      <div
        key={lesson.id}
        className="col-12 col-md-6 col-lg-4 d-flex justify-content-evenly"
      >
        <TutorCard key={lesson.id} lesson={lesson} />
      </div>
    );
  });

  return (
    <div>
      <h1 className="">{subject}</h1>
      {lessons.length > 0 && (
        <div className="container w-75">
          <div className="row justify-content-center g-5">{lessonList}</div>
        </div>
      )}
    </div>
  );
};

Subject.getInitialProps = async (context, client) => {
  const { subject } = context.query;

  const { data } = await client.get(`/api/tickets/${subject}`);

  return { subject, lessons: data };
};

export default Subject;
