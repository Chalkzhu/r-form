import { createContext, useContext } from 'react';

const Context = createContext();
const useStore = () => useContext(Context);
export {
  Context,
  useStore,
};
