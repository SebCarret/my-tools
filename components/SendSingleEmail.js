import { useState } from "react";
import { Form, Button, Input, message, Select } from "antd";
import { MailOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function sendSingleEmail({email, emailjsId}) {

    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const chooseTemplate = value => form.setFieldsValue({template: value});

    const sendEmail = async values => {
        setLoading(true);
        let template_params = {
            firstname: values.firstname,
            company: values.company,
            email: values.email,
            reply_to: email
        };
        const emailjs = (await import('emailjs-com')).default;
        emailjs.send('ovh', values.template, template_params, emailjsId)
            .then(function (response) {
                if (response.status === 200) {
                    message.success('Email successfully sent !')
                } else {
                    message.error('Email unsuccessfully sent... Please try again')
                };
                setLoading(false);
                form.resetFields()
            }, function (error) {
                console.log('FAILED...', error);
            });
    };

    return (
        <Form layout="inline" form={form} onFinish={sendEmail}>
            <Form.Item
                name="firstname"
                rules={[
                    {
                        required: true,
                        message: 'Firstname is required'
                    }
                ]}
            >
                <Input
                    placeholder="John"
                />
            </Form.Item>
            <Form.Item
                name="company"
                rules={[
                    {
                        required: true,
                        message: 'Company name is required'
                    }
                ]}
            >
                <Input
                    placeholder="Facebook"
                />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'email is required'
                    }
                ]}
            >
                <Input
                    placeholder="john@facebook.com"
                />
            </Form.Item>
            <Form.Item 
                name="template"
                rules={[
                    {
                        required: true,
                        message: 'template is required'
                    }
                ]}
            >
                <Select
                    defaultValue="Select your template"
                    style={{ width: 200 }}
                    onChange={chooseTemplate}
                >
                    <Option value="template_tc8hq0b">First mail</Option>
                    <Option value="template_jvzhQ1xP">Follow up</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<MailOutlined />}
                    loading={loading}
                // disabled={credits === 0 ? true : false}
                >
                    Send email
                </Button>
            </Form.Item>
        </Form>
    )
}