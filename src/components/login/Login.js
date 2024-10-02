import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Update this URL to your backend login URL
      const response = await axios.post('http://localhost:5000', values);
      console.log('Login Success:', response.data);
      // Save JWT to local storage or state
      localStorage.setItem('token', response.data.token);
      navigate('/main'); // Redirect to the main page
    } catch (error) {
      console.error('Login Failed:', error.response?.data?.message || error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>Login</h2>
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
