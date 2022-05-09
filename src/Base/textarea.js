import React from 'react';
import { Input } from 'antd';

const RInput = ({readonly, ...resetProps}) => {
  const config = {
    placeholder: "请输入",
    disabled: readonly,
    ...resetProps
  };
  return <Input.TextArea {...config} />
};

export default RInput;