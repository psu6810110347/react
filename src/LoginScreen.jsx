import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios'
import Cookies from 'js-cookie';

 const handleLogin = async (formData) => {
  try {
    setIsLoading(true);
    const response = await axios.post(URL_AUTH, formData);
    const token = response.data.access_token;

    Cookies.set('token', token, { expires: 1 }); // เก็บไว้ใน Cookie 1 วัน
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    props.onLoginSuccess(token);
  } catch(err) {
    setErrMsg(err.message);
  } finally { setIsLoading(false); }
}

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  const handleLogin = async (formData) => {
    try{
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, formData);
      const token = response.data.access_token;
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      props.onLoginSuccess();
    } catch(err) { 
      console.log(err)
      setErrMsg(err.message)
    } finally { setIsLoading(false) }
  }

  return(
    <Form
      onFinish={handleLogin}
      autoComplete="off">
      {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="username"
        rules={[{required: true,}]}>
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true},]}>
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button 
           type="primary" 
           htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
