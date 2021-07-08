import { useState } from "react";
import { Form, Button, Input, message, Select } from "antd";
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";

const { Option } = Select;

export default function sendSingleEmail({ email, emailjsId, templates, adminId }) {

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [form] = Form.useForm();
    const router = useRouter();

    const chooseTemplate = value => {
        form.setFieldsValue({ template: value });
        setButtonDisabled(false)
    }; 

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
                form.resetFields();
                setButtonDisabled(true)
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
                {
                    templates.length === 0
                        ? <Button icon={<SettingOutlined />} onClick={() => router.push(`/account/${adminId}`)}>Set templates</Button>
                        : <Select
                                defaultValue="Select your template"
                                style={{ width: 200 }}
                                onChange={chooseTemplate}
                            >
                                {
                                    templates.map(id => (
                                        <Option value={id}>{id}</Option>
                                    ))
                                }
                            </Select>
                }

            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<MailOutlined />}
                    loading={loading}
                    disabled={buttonDisabled}
                >
                    Send email
                </Button>
            </Form.Item>
        </Form>
    )
}