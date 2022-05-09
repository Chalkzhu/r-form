import React, {useMemo} from 'react';
import { Input, Textarea, InputNumber, Select, Checkbox, Radio, DatePicker } from './Base/index.js';
import { useStore } from './context';

const Control = (ComProps) => {
  const { $id, widget, enum: values, enumNames, disabled, props, ...reset } = ComProps;
  const { widgets } = useStore();

  const options = useMemo(() => {
    return values?.map((v, idx) => ({label: enumNames[idx], value: v})) || [];
  }, [enumNames, values]);

  const types = {
    input: <Input readonly={disabled} {...props} {...reset} />,
    textarea: <Textarea readonly={disabled} {...props} />,
    number: <InputNumber readonly={disabled} {...props} />,
    select: <Select options={options} readonly={disabled} {...props} {...reset} />,
    date: <DatePicker type="date" readonly={disabled} {...props} />,
    dateRange: <DatePicker type="range" readonly={disabled} {...props} />,
    checkbox: <Checkbox options={options} readonly={disabled} {...props} />,
    checkboxes: <Checkbox options={options} readonly={disabled} {...props} />,
    radio: <Radio options={options} readonly={disabled} {...props} />,
  };

  return !!types[widget] ? types[widget] : widgets[widget](ComProps)
  // return !!types[widget] ? types[widget] : types['input']
};

export default Control;
