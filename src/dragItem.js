import React, { useRef } from 'react';
import cn from 'classnames';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { useStore } from './context';
import IconFont from './IconFont';
import useControl from './Control';

const DragItem = (props) => {
  const { columns, onChange, onSetting } = useStore();
  const { width, name, $id, required, title, description, seq } = props;
  const Control = useControl(props);
  const ref = useRef(null);

  // 设置按钮
  const handleSetting = () => onSetting?.(props);

  // 删除事件
  const handleDelete = () => {
    const nValue = columns.filter(v => v.$id !== $id );
    onChange(nValue, 'delete');
  };

  // 换位
  const moveCard = (dragIndex, hoverIndex) => {
    const nValue = columns.map(v => {
      return {
        ...v,
        seq: v.seq === dragIndex ? hoverIndex : v.seq === hoverIndex ? dragIndex : v.seq,
      };
    })
    onChange(nValue, 'drop');
  };

  const [{ handlerId }, drop] = useDrop({
    accept: 'editFormItem',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(reactDndItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = reactDndItem.index;
      const hoverIndex = seq;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      reactDndItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'editFormItem',
    item: () => {
      return { index: seq };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  // drag(drop(ref));
  drop(ref);

  return (
    <>
      <div ref={ref} data-handler-id={handlerId} style={{ width }} className="drag_col">
        <div ref={preview} className={cn('drag_item', { active: isDragging })}>
          <div className="drag_header">
            <div className="drag_header_title">
              {required && <span className="require">*</span>}
              {title}
              {description && (
                <Tooltip title={description}>
                  <QuestionCircleOutlined />
                </Tooltip>
              )}
            </div>
            <div className="drag_header_extend">
              <IconFont type="lmweb-setting" onClick={handleSetting} />
              <IconFont type="lmweb-delete" onClick={handleDelete} />
              <IconFont ref={drag} type="lmweb-drag" />
            </div>
          </div>
          <div className="drag_body">{Control}</div>
        </div>
      </div>
    </>
  )
};

export default DragItem;