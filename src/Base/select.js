import React from 'react';
import { Select } from 'antd';

const RSelect = ({ options, readonly, ...resetProps}) => {
  // 修改默认配置
  const config = {
    showSearch: true,
    allowClear: true,
    placeholder: "请选择",
    filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    disabled: readonly,
    ...resetProps,
  };

  return (
    <>
      <Select {...config}>
        {options?.map((v) => (
          <Select.Option key={v.value} value={v.value} disabled={v.readonly}>
            {v.label}
          </Select.Option>
        ))}
      </Select>
    </>
  )
};

export default RSelect;