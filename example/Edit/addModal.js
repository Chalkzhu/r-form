import React, { useEffect } from 'react';
import { Button, Input, Select, Radio, Modal, Form, message, Row, Col } from 'antd';
import { useStore } from './context';
import { DynamicOptions } from './components';

const typeArr = [
  { label: '输入', value: 'input' },
  { label: '数值', value: 'number' },
  { label: '选择器', value: 'select' },
  { label: '日期', value: 'date' },
  { label: '日期区间', value: 'dateRange' },
  { label: '文本', value: 'textarea' },
  { label: '单选', value: 'radio' },
  { label: '复选', value: 'checkbox' },
]

const AddModal = () => {
  const { dispatch, state } = useStore();
  const { visible } = state;
  const [form] = Form.useForm();

  const onClose = () => {
    dispatch({ type: 'changeVisible', visible: false })
  };

  const valid = async () => {
    try {
      const values = await form.validateFields();
      const { columns } = state;
      if (visible.isEdit) {
        const resetColumns = columns.map(v => v['$id'] === visible['$id'] ? { ...v, ...values } : v)
        dispatch({ type: 'changeColumns', columns: resetColumns })
      } else {
        if (columns.some(v => v['$id'] === values['$id'])) {
          throw new Error('name');
        }
        const nValue = [...columns, { seq: columns.length + 1, ...values }];
        console.log('values', values, nValue);
        dispatch({ type: 'changeColumns', columns: nValue })
      }
      onClose?.();
      message.success('添加成功！', 1.5);
    } catch (errInfo) {
      if (errInfo.message === 'name') {
        return message.warning('唯一值不可重复！', 1.5);
      }
      message.warning('必填项不可为空！', 1.5);
    }
  };

  // 校验
  const rules = (text) => [{ required: true, message: `${text}不可为空` }];

  // 动态展示类型选择
  const DynamicSelect = ({ getFieldValue }) => {
    const widget = getFieldValue('widget');
    if (['date', 'dateRange'].includes(widget)) {
      return (
        <>
          <Col span={12}>
            <Form.Item name="dateType" label="时间类型" rules={rules('时间类型')}>
              <Select allowClear placeholder="请选择">
                <Select.Option value="date">默认</Select.Option>
                <Select.Option value="week">周</Select.Option>
                <Select.Option value="month">月</Select.Option>
                <Select.Option value="quarter">季</Select.Option>
                <Select.Option value="year">年</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </>
      );
    };

    if (['select', 'checkbox'].includes(widget)) {
      return (
        <>
          <Col span={12}>
            <Form.Item name="dataType" label="数据选项" rules={rules('数据选项')}>
              <Select allowClear placeholder="请选择">
                <Select.Option value="diy">自定义</Select.Option>
                <Select.Option value="brand">品牌</Select.Option>
                <Select.Option value="supplierCategory">供应商分类</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </>
      );
    }
  };

  const onValuesChange = (val) => {
    console.log('val', val)
    if (val.dataType === 'brand') {
      form.setFieldsValue({ api: '/basicdatacenter/api/app/basic-data/data-by-group-key?group=品牌', options: [] })
    }
  };

  const config = {
    title: visible.isEdit ? '编辑' : '新增',
    visible,
    width: 560,
    onCancel: onClose,
    footer: [
      <Button key="cancel" onClick={onClose} size="middle">
        取消
      </Button>,
      <Button type="primary" key="back" onClick={valid} size="middle">
        确定
      </Button>,
    ],
  };

  const initialValues = { required: false, disabled: false };

  // 弹窗打开赋值
  useEffect(() => {
    // 编辑
    if (!!visible && typeof visible !== 'boolean') {
      form.setFieldsValue({ ...visible });
    }
    // 新增
    if (visible && typeof visible === 'boolean') {
      form.resetFields();
    }
  }, [visible]);

  return (
    <>
      <Modal {...config}>
        <div>
          <Form form={form} layout="vertical" size="default" initialValues={initialValues} onValuesChange={onValuesChange}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="title" label="字段名" rules={rules('字段名')}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="$id" label="唯一key" rules={rules('唯一值')}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="widget" label="组件类型" rules={rules('组件类型')}>
                  <Select allowClear placeholder="请选择">
                    {typeArr.map((v) => <Select.Option key={v.value} value={v.value}>{v.label}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.widget !== currentValues.widget}
              >
                {DynamicSelect}
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.dataType !== currentValues.dataType}
              >
                {({ getFieldValue }) => getFieldValue('dataType') === 'diy' ? <DynamicOptions /> : null}
              </Form.Item>
              <Col span={12}>
                <Form.Item name="description" label="提示内容">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="required" label="是否必填" rules={rules('是否必填')}>
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="disabled" label="是否只读" rules={rules('是否必填')}>
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Form.Item hidden name="api">
                <Input />
              </Form.Item>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  )
};

export default AddModal;
