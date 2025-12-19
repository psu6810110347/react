import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 

const URL_AUTH = "/api/auth/login";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, formData);
      const token = response.data.access_token;

      Cookies.set('token', token, { expires: 1 }); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      props.onLoginSuccess(); 
      navigate('/books'); 

    } catch (err) {
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