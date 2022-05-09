import { createContext, useContext, useReducer } from 'react';

const initialState = {
  columns: [], // 表单项数据
  visible: false, // 弹框编辑
};

const reducer = (state, action) => {
  const { columns, visible } = action;

  switch (action.type) {
    case 'changeColumns':
      return {
        ...state,
        columns,
      }
    case 'changeVisible':
      return {
        ...state,
        visible,
      }

    default:
      throw new Error();
  }
};

const useContent = () => useReducer(reducer, initialState);
const Context = createContext();
const useStore = () => useContext(Context);

export {
  Context,
  useContent,
  useStore,
};
