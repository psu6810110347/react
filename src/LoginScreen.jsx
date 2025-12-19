import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const URL_AUTH = "/api/auth/login";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      
      // 1. ส่งข้อมูลไป Login
      const response = await axios.post(URL_AUTH, formData);
      const token = response.data.access_token;

      // 2. เก็บ Token ลงใน Cookie (สำคัญมาก: เพื่อให้ Refresh แล้วไม่หลุด)
      Cookies.set('token', token, { expires: 1 });

      // 3. ตั้งค่า Header ให้ Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 4. แจ้ง App.jsx ว่า Login สำเร็จเพื่อเปลี่ยนหน้า
      props.onLoginSuccess();

    } catch (err) {
      console.log(err);
      setErrMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
      <Form onFinish={handleLogin} autoComplete="off" layout="vertical">
        {errMsg && (
          <Form.Item>
            <Alert message={errMsg} type="error" showIcon />
          </Form.Item>
        )}

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}