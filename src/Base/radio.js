import React from 'react';
import { Radio, Space } from 'antd';

const RInput = ({ options, readonly, ...resetProps }) => {
  const config = {
    disabled: readonly,
    ...resetProps
  };
  return <Radio.Group {...config}>
    <Space wrap>
      {options?.map((v) => (
        <Radio key={v.value} value={v.value}>
          {v.label}
        </Radio>
      ))}
    </Space>
  </Radio.Group>
};

export default RInput;