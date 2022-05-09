import React from 'react';
import { Input } from 'antd';

const RInput = ({readonly, default: defaultValue, ...resetProps}) => {
  const config = {
    placeholder: "请输入",
    disabled: readonly,
    value: defaultValue,
    ...resetProps
  };
  return <Input {...config} />
};

export default RInput;