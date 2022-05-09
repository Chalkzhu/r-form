import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './dragItem';
import { Context } from './context';
import './index.less';

// 接收columns 数组
const FormJsonEdit = (props) => {
  const { columns, onChange, widgets, onSetting } = props;

  return (
    <div className="form_json_edit">
      <Context.Provider value={{ columns, onChange, widgets, onSetting }}>
        <DndProvider backend={HTML5Backend}>
          <div gutter={[16, 16]} className='drag_box'>
            {columns?.sort((a, b) => a?.seq - b?.seq)?.map((v) => <DragItem key={v.$id} {...v} />)}
          </div>
        </DndProvider>
      </Context.Provider>
    </div>
  )
};

export default FormJsonEdit;
