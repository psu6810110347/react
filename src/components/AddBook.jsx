import React from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function AddBook({ onBookAdded, categories }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // ยิง API แบบ POST ไปที่ /book (ตรวจสอบ Path ให้ตรงกับ Backend)
      await axios.post('/book', values); 
      
      message.success('เพิ่มหนังสือเรียบร้อยแล้ว');
      form.resetFields(); // ล้างข้อมูลในฟอร์ม
      
      if (onBookAdded) {
        onBookAdded(); // เรียกฟังก์ชัน fetchBooks ในหน้าหลักเพื่ออัปเดตตาราง
      }
    } catch (error) {
      console.error('Add book error:', error);
      message.error('ไม่สามารถเพิ่มหนังสือได้: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
    >
      <Form.Item name="title" rules={[{ required: true, message: 'กรุณากรอกชื่อหนังสือ' }]}>
        <Input placeholder="ชื่อหนังสือ" />
      </Form.Item>

      <Form.Item name="author" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้แต่ง' }]}>
        <Input placeholder="ผู้แต่ง" />
      </Form.Item>

      <Form.Item name="price" rules={[{ required: true, message: 'ราคา' }]}>
        <InputNumber min={0} placeholder="ราคา" />
      </Form.Item>

      <Form.Item name="stock" rules={[{ required: true, message: 'สต็อก' }]}>
        <InputNumber min={0} placeholder="สต็อก" />
      </Form.Item>

      <Form.Item name="categoryId" rules={[{ required: true, message: 'หมวดหมู่' }]}>
        <Select placeholder="เลือกหมวดหมู่" style={{ width: 150 }}>
          {categories.map(cat => (
            <Option key={cat.value} value={cat.value}>{cat.label}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          + เพิ่มหนังสือ
        </Button>
      </Form.Item>
    </Form>
  );
}