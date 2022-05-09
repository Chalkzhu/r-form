import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import { Spin, Image, message } from 'antd';
import IconFont from '@/components/IconFont';
import { fileData } from '@/apis';

const Wrapper = styled.div`
  display: inline-flex;
  .upload_body {
    display: inline-flex;
    flex-wrap: wrap;
    font-size: 12px;
    line-height: 1;

    .view_box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d9d9d9;
      padding: 8px;

      .view_item_thum {
        position: relative;
        width: 86px;
        height: 86px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: 0.3s;
          z-index: 1;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        // 遮罩
        .view_item_action {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          display: flex;
          z-index: 2;

          & > div {
            font-size: 16px;
            color: #fff;
            padding: 0 4px;
            cursor: pointer;
          }
        }
      }

      &:hover {
        .view_item_thum {
          &::before {
            opacity: 1;
          }

          .view_item_action {
            opacity: 1;
          }
        }
      }
    }

    .upload_card_box {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 104px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      transition: all 0.3s;

      .upload_input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      &:hover {
        border-color: #1890fc;
      }
    }
  }
`;

// 视图展示
const ViewImg = ({ externalUrl, filePath, realFileName, onChange }) => {
  const thumbUrl = `${externalUrl}/${filePath}${realFileName}?x-oss-process=image/resize,w_100`;
  // 受控的大图预览
  const [visible, setVisible] = useState(false);

  // 预览
  const handlePreview = () => {
    setVisible(true);
  };

  // 删除
  const handleDelete = () => {
    onChange?.(realFileName);
  };

  return (
    <>
      <div className="view_box">
        <div className="view_item_thum">
          <Image
            width={86}
            height={86}
            src={thumbUrl}
            preview={{
              visible,
              src: `${externalUrl}/${filePath}${realFileName}`,
              onVisibleChange: (value) => {
                setVisible(value);
              },
            }}
          />
          <div className="view_item_action">
            <div className="view_item_preview" onClick={handlePreview}>
              <IconFont type="lmweb-eye" />
            </div>
            <div className="view_item_delete" onClick={handleDelete}>
              <IconFont type="lmweb-delete" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const UploadCard = (props) => {
  const {
    onChange,
    label = '上传图片',
    required,
    accept,
    type = ['jpg', 'jpeg', 'png'],
    fileSize = 50,
    dir = 'Supplier',
    children,
  } = props;
  // 上传时调用，获取token
  const { data: ossData, refetch } = fileData.getOssPolicyTokenCache({ path: dir }, { enabled: false });
  // 上传至阿里云OSS
  const aliyunOssUploadMutate = useMutation(fileData.aliyunOSSUpload);

  // 开始上传至OSS
  const uploadFile = ({ OSS = ossData, file, realFileName }) => {
    const formData = new FormData();
    formData.append('key', OSS.dir + realFileName);
    formData.append('policy', OSS.policy);
    formData.append('OSSAccessKeyId', OSS.accessid);
    formData.append('callback', OSS.callback);
    formData.append('signature', OSS.signature);
    formData.append('file', file);
    aliyunOssUploadMutate.mutate(formData);

    const params = {
      fileTypeCode: file.type,
      fileTypeName: file.type,
      fileName: file.name, // 上传时的文件名
      realFileName, // oss的文件名
      fileSize: file.size,
      internalUrl: '',
      externalUrl: OSS.shortlink,
      filePath: OSS.dir,
      seq: 0,
    };

    onChange?.(params);
  };

  // token处理
  const fileUpload = async (file) => {
    const resetFile = file;
    const suffix = resetFile.name.slice(resetFile.name.lastIndexOf('.'));
    const realFileName = Date.now() + suffix;

    if (!ossData?.expire || ossData.expire * 1000 < Date.now()) {
      const { data: OSS } = await refetch();
      uploadFile({ OSS, file, realFileName, suffix });
    } else {
      uploadFile({ file, realFileName, suffix });
    }
  };

  // 上传前置处理
  const beforeUpload = (e) => {
    const file = e.target.files;
    // 循环文件检查是否存在不符合要求的文件
    for (let i = 0, len = file.length; i < len; i += 1) {
      const item = file[i];
      if (!type.includes(item.name.replace(/.*\./, '').toLowerCase())) {
        const content = type.join('、');
        return message.warning(`文件上传失败！仅支持${content}的文件类型！`, 1.5);
      }
      if (item.size / 1024 / 1024 > fileSize) {
        return message.warning(`文件上传失败！附件大小不能超过${fileSize}M！`, 1.5);
      }
      // 单个文件上传
      fileUpload(item);
    }

    return false;
  };

  // 未上传时的占位符
  const UploadPlaceholder = () => (
    <>
      <IconFont type="lmweb-plus" style={{ fontSize: 24 }} />
      <div style={{ marginTop: 8 }}>
        {required && <span style={{ color: '#FD4D4E' }}>*</span>}
        {label || '上传图片'}
      </div>
    </>
  );

  const config = {
    type: 'file',
    accept,
    title: '',
    className: 'upload_input',
    onChange: beforeUpload,
  };
  return (
    <>
      <Spin spinning={aliyunOssUploadMutate?.isLoading} size="small">
        <div className="upload_card_box">
          <div className="upload_card_action">
            <input {...config} />
            <div>{children || <UploadPlaceholder />}</div>
          </div>
        </div>
      </Spin>
    </>
  );
};

const Index = (props) => {
  const { value = [], onChange, length = 1, style = { gap: 16 } } = props;
  // 上传
  const handleChange = (file) => {
    const nValue = [...value, file];
    onChange?.(nValue);
  };

  // 删除
  const handleDelete = (realFileName) => {
    const nValue = value.filter((v) => v.realFileName !== realFileName);
    onChange?.(nValue);
  };

  return (
    <Wrapper>
      <div className="upload_body" style={style}>
        {value.map((v) => (
          <ViewImg key={v.realFileName} {...v} onChange={handleDelete} />
        ))}
        {Array.isArray(value) ? (
          value.length < length ? (
            <UploadCard {...props} onChange={handleChange} />
          ) : null
        ) : value ? null : (
          <UploadCard {...props} onChange={handleChange} />
        )}
      </div>
    </Wrapper>
  );
};

export default Index;
