import React from 'react';
import { InputNumber } from 'antd';

const RInput = ({readonly, style, ...resetProps}) => {
  const config = {
    placeholder: "请输入",
    disabled: readonly,
    style: { width: '100%', ...style },
    ...resetProps
  };
  return <InputNumber {...config} />
};

export default RInput;