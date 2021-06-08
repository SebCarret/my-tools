import { useState } from 'react';
import { Form, Input, Button, Card, Avatar } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from '../styles/email-verif.module.css';

const { Meta } = Card;

export default function EmailSingleVerif({ credits, minusCredits }) {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [form] = Form.useForm();

    const verifyEmail = async values => {
        setLoading(true);
        const request = await fetch(`/api/verify-email?email=${values.email}`);
        const response = await request.json();
        if (response.success){
            setStatus(response.status);
            minusCredits(credits -1)
        }
        setLoading(false)
    };

    let pictoToDisplay;
    let description;
    switch (status){
        case 'valid':
            pictoToDisplay = <CheckCircleOutlined style={{color: 'green', fontSize: 25}} />;
            description = "You can send email to this adress."
        break;
        case 'unknown':
            pictoToDisplay = <QuestionCircleOutlined style={{color: 'orange', fontSize: 25}} />;
            description = "Unable to verify this email sorry..."
        break;
        case 'invalid':
            pictoToDisplay = <CloseCircleOutlined style={{color: 'red', fontSize: 25}} />;
            description = "This email doesn't exist or is invalid."
    };

    return (
        <div id={styles.singleContainer}>
            <Form layout="inline" form={form} onFinish={verifyEmail}>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Email is required'
                        }
                    ]}
                >
                    <Input placeholder="john.doe@domain.com" style={antStyles.input} allowClear />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<CheckCircleOutlined />}
                        loading={loading}
                        disabled={credits === 0 ? true : false}
                    >
                        Verify email
                    </Button>
                </Form.Item>
            </Form>
            {
                status === ''
                    ? null
                    : <Card bordered style={antStyles.card}>
                        <Meta
                            avatar={pictoToDisplay}
                            title={`This email is ${status}`}
                            description={description} 
                        />
                    </Card>
            }
        </div>
    )
};

const antStyles = {
    input: {
        width: 300
    },
    card: {
        marginTop: 40
    }
};