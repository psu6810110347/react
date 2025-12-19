import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Button, theme, Typography, Card, Space, message, Spin, Modal, Form, Input, InputNumber, Select } from 'antd';
import { BookOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function BookScreen(props) {
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // State สำหรับ Modal แก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  // 1. ฟังก์ชันดึงข้อมูล (Path /book)
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/book'); 
      setBooks(response.data); 
    } catch (err) {
      message.error("ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/book-category');
      const options = response.data.map(c => ({ value: c.id, label: c.name }));
      setCategories(options);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [fetchBooks, fetchCategories]);

  // 2. ฟังก์ชันจัดการ Events
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/book/${id}`);
      message.success("ลบหนังสือเรียบร้อยแล้ว");
      fetchBooks();
    } catch (err) {
      message.error("ไม่สามารถลบข้อมูลได้");
    }
  };

  const handleLikeBook = async (id) => {
    try {
      await axios.post(`/book/${id}/like`); 
      message.success("กด Like เรียบร้อย");
      fetchBooks(); 
    } catch (error) {
      message.error("ไม่สามารถกด Like ได้");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      categoryId: book.category?.id 
    });
  };

  const handleSaveEdit = async (values) => {
    try {
      await axios.put(`/book/${editingBook.id}`, values); 
      
      message.success("แก้ไขข้อมูลสำเร็จ");
      setIsEditModalOpen(false);
      setEditingBook(null);
      fetchBooks(); 
    } catch (error) {
      console.error("Edit Error Detail:", error.response || error);
      message.error(`แก้ไขไม่สำเร็จ: ${error.response?.data?.message || "ตรวจสอบ Path ของ API"}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingBook(null);
    form.resetFields();
  };

  const onLogoutClick = () => {
    props.onLogout();
    navigate('/login');
  };

  // 3. ส่วนการแสดงผล (ต้องอยู่ในปีกกาของ BookScreen)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>BOOK STORE</Title>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogoutClick}>Logout</Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu mode="inline" defaultSelectedKeys={['1']} items={[{ key: '1', icon: <BookOutlined />, label: 'รายการหนังสือ' }]} />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="จัดการข้อมูลหนังสือ">
                <AddBook onBookAdded={fetchBooks} categories={categories} />
              </Card>
              <Card title="รายการหนังสือทั้งหมด">
                <Spin spinning={loading}>
                  <BookList
                    data={books}
                    onDeleted={handleDelete}
                    onLiked={handleLikeBook}
                    onEdit={handleEditClick}
                  />
                </Spin>
              </Card>
            </Space>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Book Store Application ©2025</Footer>
        </Layout>
      </Layout>


      <Modal
        title="แก้ไขข้อมูลหนังสือ"
        open={isEditModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancelEdit}
        okText="บันทึก"
        cancelText="ยกเลิก"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item name="title" label="ชื่อหนังสือ" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="ผู้แต่ง" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้แต่ง' }]}>
            <Input />
          </Form.Item>
          <Space>
            <Form.Item name="price" label="ราคา" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="stock" label="จำนวนสต็อก" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Space>
          <Form.Item name="categoryId" label="หมวดหมู่">
            <Select placeholder="เลือกหมวดหมู่">
              {categories.map(c => (
                <Option key={c.value} value={c.value}>{c.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}