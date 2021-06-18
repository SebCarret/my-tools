import { useState } from "react";
import { Form, Button, Input, message } from "antd";
import { MailOutlined } from '@ant-design/icons';
import TopMenu from '../../components/TopMenu';
import styles from '../../styles/email-finder.module.css';

export default function mailingContainer() {

    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const sendEmail = async values => {
        setLoading(true);
        let template_params = {
            firstname: values.firstname,
            company: values.company,
            email: values.email,
            reply_to: process.env.NEXT_PUBLIC_EMAIL_SENDER
        };
        const emailjs = (await import('emailjs-com')).default;
        emailjs.send('ovh', 'template_tc8hq0b', template_params, process.env.NEXT_PUBLIC_EMAILJS_ID)
        .then(function(response) {
            if (response.status === 200){
                message.success('Email successfully sent !')
            } else {
                message.error('Email unsuccessfully sent... Please try again')
            };
            setLoading(false);
            form.resetFields()
         }, function(error) {
            console.log('FAILED...', error);
         });
    };

    return (
        <div id={styles.container}>
            <TopMenu />
            <div id={styles.topContent}>
                <div id={styles.titleContainer}>
                    <h2 id={styles.title}>Send single email</h2>
                    {/* <Badge count={verificationCredits}>
                        <Tooltip title={`Credits availables until ${credits.date}`}>
                            <CheckCircleOutlined id={styles.verifPicto} />
                        </Tooltip>
                    </Badge> */}
                </div>
                <p>Please fill in all fields below to respect dynamic variables set in your EmailJS template.</p>
            </div>
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
        </div>
    )
}