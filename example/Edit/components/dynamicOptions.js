import React from 'react';
import { Form, Row, Col, Button, Input } from 'antd';

// 动态增加静态数据
const dynamicOptions = () => {
  return (
    <Form.List name="options">
      {(fields, { add, remove }, { errors }) => (
        <Col span={24}>
          {/* icon={<IconFont type="lmweb-plus" />} */}
          <Button block type="dashed" onClick={() => add()} icon={<i className="iconfont lmweb-plus" />} style={{ marginBottom: 16 }}>
            新增数据
          </Button>
          {fields.map(({ key, name, ...restField }) => (
            <Row gutter={16} key={key}>
              <Col span={11}>
                <Form.Item {...restField} name={[name, 'label']}>
                  <Input placeholder="选项名" />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item {...restField} name={[name, 'value']}>
                  <Input placeholder="选项值" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <div style={{ paddingTop: 4, fontSize: 16 }}>
                  <i className='iconfont lmweb-minus-circle' onClick={() => remove(name)} />
                </div>
              </Col>
            </Row>
          ))}
          {/* 展示错误信息 */}
          <Form.ErrorList errors={errors} />
        </Col>
      )}
    </Form.List>
  );
};

export default dynamicOptions;
