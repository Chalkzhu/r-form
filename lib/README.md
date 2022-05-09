
### FormJson

> 表单的json化配置，使用 **`JSON Schema`** [国际规范](https://json-schema.org/understanding-json-schema/) 

#### Schema结构

**结构描述**

```json
{
    type: 'objcet', // 组件值的类型
    properties: { // 只在对象组件（type: object）中使用，properties 用于包裹对象的子属性：
        title: '输入框', // 标题，作为label展示
        type: 'string', // 组件值的类型
        widget: 'textarea', // 部件名称
        default: '默认值', // 默认值
        required: true, // 必填
    }
}
```



**基础属性**

- `type`, `format`, `enum` 和 `widget` 字段决定了使用哪个组件来渲染
- `type`, `format`, `min`, `max`, `required` 和 `rules` 字段用于做校验判断
- `props` 字段用于补充组件支持的更为细致的属性

```json
{
	displayType: 'row',
  labelWidth: 130,
  type: 'object',
  properties: {
    url: {
      title: 'url输入框',
      placeholder: '//www.taobao.com',
      type: 'string',
      format: 'url',
      required: true,
    },
    email: {
      title: 'email输入框',
      type: 'string',
      format: 'email',
    },
    string: {
      title: '正则校验字符串',
      description: 'a-z',
      type: 'string',
      hidden: false,
      disabled: true,
      rules: [{ pattern: '^[a-z]+$' }]
    },
  },
}
```



#### Api

| 参数        | 说明         | 类型   | 可选                                                         | 默认 |
| ----------- | ------------ | ------ | ------------------------------------------------------------ | ---- |
| title       | 标题         | String | -                                                            | -    |
| type        | 值的数据类型 | String | 'string', 'number', 'boolean', 'array', 'object', 'range', 'html' | -    |
| format      | 格式化       | String | 'image', 'textarea', 'color'/'email', 'url'/ 'dateTime', 'date', 'time', 'upload' |      |
| displayType | 展示方式     | String | 'row', 'column'                                              | row  |
| description | 描述         | String | -                                                            | -    |
| descType    | 描述的类型   | String | 'text'/'icon'                                                | -    |
|             |              |        |                                                              |      |



### 使用示例



> 展示

```jsx
import React, { useEffect } from 'react'
import { Button } from 'antd';
import FormJson, { useForm } from 'RForm';
import Setting from './Edit/setting';

const schema = {
  type: 'object',
  displayType: 'row',
  properties: {
    input1: {
      title: '简单输入框',
      type: 'string',
      required: true,
      default: '111',
      description: '来FR个提示',
      tooltip: 'antd提示无效',
      width: '33.333%',
      widget: 'input',
      seq: 1,
    },
    select1: {
      title: '单选',
      type: 'string',
      width: '33.333%',
      tooltip: 'antd提示无效',
      widget: 'select',
      api: '基础数据',
      seq: 2,
    },
    object2: {
      title: '单选',
      type: 'string',
      enum: ['ck1', 'ck2'],
      enumNames: ['选项一', '选项二'],
      width: '33.333%',
      widget: 'radio',
      seq: 3,
    },
    object3: {
      title: '复选',
      type: 'array',
      enum: ['ck1', 'ck2'],
      enumNames: ['选项一', '选项二'],
      width: '33.333%',
      widget: 'checkboxes',
      seq: 4,
      buttons: [
        {
          "text": "复制",
          "icon": "CopyOutlined",
          "callback": "copyLast"
        }
      ]
    },
  },
};


const Paas = () => {
  const form = useForm();

  // 提交表单
  const onFinish = (formData, errors) => {
    if (errors.length > 0) {
      console.log('errors:', errors)
    } else {
      console.log('formData:', formData)
    }
  };

  useEffect(() => {
    // 加载数据至下拉框: 服务端获取schema非空时使用
    setTimeout(() => {
      form && form.setSchemaByPath('select1', {
        enum: ['east', 'south', 'west', 'north'],
        enumNames: ['东', '南', '西', '北'],
      });
    }, 1000);
  }, [])

  return (
    <>
      <div>
        <div>k333</div>
        <div>
          <Setting schema={schema} form={form} />
          <FormJson schema={schema} form={form} onFinish={onFinish} />
          <Button type="primary" onClick={() => form.submit()}>提交</Button>
        </div>
      </div>
    </>
  )
};

export default Paas;
```



