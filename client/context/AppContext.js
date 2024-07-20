import { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [curSubject, setCurSubject] = useState();
  const [curLesson, setCurLesson] = useState();

  return (
    <AppContext.Provider value={{ curLesson, setCurLesson, curSubject, setCurSubject }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;