import React from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';

const RInput = ({readonly, type = 'date', dateType = 'date', style, ...resetProps}) => {
  const config = {
    disabled: readonly,
    style: { width: '100%', ...style },
    locale,
    picker: dateType,
    ...resetProps
  };

  const Control = () => {
    switch (type) {
      case 'date':
        return <DatePicker {...config} />;
      case 'range':
        return <DatePicker.RangePicker {...config} />;
    
      default:
        break;
    }
  };
  return (
    <>
    {Control()}
    </>
  );
};

export default RInput;