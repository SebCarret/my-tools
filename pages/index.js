import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import LoadingDatas from '../components/LoadingDatas';

const FormItem = Form.Item;

export default function Login() {

  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const admin = window.localStorage.admin;
      if (admin) {
        router.push('/home')
      } else {
        setWaiting(false)
      }
    }
  }, []);

  const adminLogin = async values => {
    setLoading(true);
    let request = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    let response = await request.json();
    if (response.success) {
      const adminDatas = {
        id: response.admin._id,
        firstname: response.admin.firstname
      };
      localStorage.setItem('admin', JSON.stringify(adminDatas));
      router.push('/home')
    } else {
      message.error(response.error)
    };
    setLoading(false)
  };

  if (waiting) {
    return <LoadingDatas />
  } else {
    return (

      <div style={styles.content}>
        <h1 style={styles.title}>Welcome on myTools ! Please login</h1>
        <div>
          <Form layout="vertical" style={{ width: 300 }} onFinish={adminLogin}>

            <FormItem
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Your email is required"
                },
                {
                  type: "email",
                  message: "Please enter a valid email"
                }]}
            >
              <Input
                size="large"
                allowClear
              />
            </FormItem>

            <FormItem
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Your password is required"
                }
              ]}
            >
              <Input.Password
                size="large"
              />
            </FormItem>

            <FormItem
              style={{ marginTop: 48 }}
            >
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                loading={loading}
              >
                Login
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
};

const styles = {
  content: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginBottom: 50
  }
};