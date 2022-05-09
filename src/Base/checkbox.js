import React from 'react';
import { Checkbox, Space } from 'antd';

const RInput = ({ options, readonly, ...resetProps }) => {
  const config = {
    disabled: readonly,
    ...resetProps
  };
  return <Checkbox.Group {...config}>
    <Space wrap>
      {options?.map((v) => (
        <Checkbox key={v.value} value={v.value}>
          {v.label}
        </Checkbox>
      ))}
    </Space>
  </Checkbox.Group>
};

export default RInput;