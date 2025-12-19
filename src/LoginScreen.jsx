import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      
      const response = await axios.post("/auth/login", {
        username: values.username,
        password: values.password
      });
      
      const token = response.data.access_token;

      Cookies.remove('token');

      if (values.remember) {
        Cookies.set('token', token, { expires: 7 }); 
      } else {
        Cookies.set('token', token); 
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      props.onLoginSuccess(token);
      navigate('/books');

    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form onFinish={handleLogin} layout="vertical">
        {errMsg && <Alert message={errMsg} type="error" style={{ marginBottom: 20 }} />}
        
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember Me</Checkbox>
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