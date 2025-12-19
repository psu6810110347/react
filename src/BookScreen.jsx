import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Button, theme, Typography, Card, Space, message, Spin } from 'antd';
import { BookOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function BookScreen(props) {
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/book'); 
      setBooks(response.data); 
  }   catch (err) {
      console.error("Error detail:", err.response);
      message.error("ดึงข้อมูลไม่สำเร็จ");
  }   finally {
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

  const onLogoutClick = () => {
    props.onLogout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/book/${id}`);
      message.success("ลบหนังสือเรียบร้อยแล้ว");
      fetchBooks();
    } catch (err) {
      message.error("ไม่สามารถลบข้อมูลได้");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: '0 40px 0 0' }}>BOOK STORE</Title>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[{ key: '1', icon: <AppstoreOutlined />, label: 'จัดการระบบ' }]}
            style={{ minWidth: 200 }}
          />
        </div>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogoutClick}>
          Logout
        </Button>
      </Header>

      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0, paddingTop: '20px' }}
            items={[{ key: '1', icon: <BookOutlined />, label: 'รายการหนังสือ' }]}
          />
        </Sider>

        <Layout style={{ padding: '24px' }}>
          <Content style={{ margin: 0, minHeight: 280 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              <Card
                title="จัดการข้อมูลหนังสือ"
                bordered={false}
                style={{ borderRadius: borderRadiusLG, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <AddBook onBookAdded={fetchBooks} categories={categories} />
              </Card>

              <Card
                title="รายการหนังสือทั้งหมด"
                bordered={false}
                style={{ borderRadius: borderRadiusLG, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* แสดงตัว Loading ขณะโหลดข้อมูล */}
                <Spin spinning={loading}>
                  <BookList
                    data={books}
                    onDeleted={handleDelete}
                  />
                </Spin>
              </Card>

            </Space>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Book Store Application ©2025 Created with Ant Design</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}