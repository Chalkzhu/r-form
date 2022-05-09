// 编辑弹窗操作示例
import React, { useEffect, useState } from 'react'
import { Button, Drawer, Space } from 'antd';
import { FormJsonEdit } from 'RForm';
import AddModal from './addModal';
import { Context, useContent, useStore } from './context';

// 新增按钮触发弹窗
const AddBtn = () => {
  const { dispatch } = useStore();

  const handleAdd = () => {
    dispatch({ type: 'changeVisible', visible: true })
  };

  return (
    <>
      <Button onClick={handleAdd}>
        新增
      </Button>
      <AddModal />
    </>
  );
};

// 抽屉里保存数据进行操作
const Setting = (props) => {
  const { schema, form, widgets } = props;
  const [state, dispatch] = useContent();
  const [visible, setVisible] = useState(false);
  // const [state, setState] = useState({ columns: [], config: { visible: false } });

  // 初始化列
  const initColumns = () => {
    const flatValue = form.flatten;
    const columns = flatValue['#']?.children.map(v => flatValue[v].schema);
    dispatch({ type: 'changeColumns', columns })
  };

  // 保存
  const onSave = () => {
    const properties = {};
    for (let i = 0, len = state.columns.length; i < len; i++) {
      const { $id, ...resetV } = state.columns[i];
      properties[$id] = { ...resetV }
    }
    const nValue = { ...schema, properties };
    console.log('onSave:', nValue);
  };

  const handleChange = (columns, type) => dispatch({ type: 'changeColumns', columns });

  const onSetting = (col) => dispatch({ type: 'changeVisible', visible: { isEdit: true, ...col } });

  const drawerAttr = {
    title: '编辑表单',
    width: 1152, // 440,720,1152 *
    placement: 'right',
    onClose: () => setVisible(false),
    visible,
    extra: (
      <>
        <Space>
          <Button onClick={initColumns}>
            重置
          </Button>
          <AddBtn />
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      </>
    ),
  };

  useEffect(() => {
    initColumns();
  }, [form]);

  return (
    <>
      <Context.Provider value={{ dispatch, state }}>
        <Button onClick={() => setVisible(true)}>打开抽屉</Button>
        <Drawer {...drawerAttr}>
          <FormJsonEdit columns={state.columns} widgets={widgets} onChange={handleChange} onSetting={onSetting} />
        </Drawer>
      </Context.Provider>
    </>
  )
};

export default Setting;