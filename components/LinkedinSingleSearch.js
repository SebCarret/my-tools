import { useState } from 'react';
import { Form, Input, Button, Card, Avatar, Tooltip, Dropdown, Menu, message } from 'antd';
import { SearchOutlined, LoadingOutlined, LinkedinOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function LinkedinSingleSearch({ credits, minusCredits }) {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const [form] = Form.useForm();

    const findProfile = async values => {
        setLoading(true);
        let datas = JSON.stringify({
            data: [{
                first_name: values.firstname,
                last_name: values.lastname,
                company: values.company
            }],
            siren: "False",
            language: 'en'
        });
        let request = await fetch('/api/data-enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: datas
        });
        let response = await request.json();
        if (response.success) {
            minusCredits(credits - 1);
            if (response.datas[0].linkedin) {
                values.linkedinUrl = `https://${response.datas[0].linkedin}`;
                values.email = response.datas[0].email[0].email;
                values.status = "unverified";
                values.domain = response.datas[0].website;
                setUser(values);
            } else {
                message.error('Sorry, no profile found for this contact on LinkedIn...')
            }
        } else {
            message.error(response.error)
        }
        setLoading(false)
    };

    const saveToList = async (key, lead) => {
        lead.list = key;
        let request = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: JSON.stringify(lead)
        });
        let response = await request.json();
        if (response.success) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    const menu = (
        <Menu onClick={e => saveToList(e.key, user)}>
            <Menu.Item key="CEO">CEO list</Menu.Item>
            <Menu.Item key="CTO">CTO list</Menu.Item>
        </Menu>)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Form layout="inline" form={form} onFinish={findProfile}>
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
                    name="lastname"
                    rules={[
                        {
                            required: true,
                            message: 'Lastname is required'
                        }
                    ]}
                >
                    <Input
                        placeholder="Doe"
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
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        loading={loading}
                        disabled={credits === 0 ? true : false}
                    >
                        Find profile
                    </Button>
                </Form.Item>
            </Form>
            {
                loading
                    ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                        <LoadingOutlined style={{ fontSize: 50, marginBottom: 25 }} />
                        <h3>Processing your request... It may takes around 30 seconds</h3>
                    </div>
                    : user !== null
                        ? <Card
                            style={{ width: 300, marginTop: 40 }}
                            actions={[
                                <Tooltip title="Visit LinkedIn profile" placement="bottom">
                                    <a href={user.linkedinUrl} target="_blank"><LinkedinOutlined style={{ fontSize: 16 }} /></a>
                                </Tooltip>
                                ,
                                <Tooltip title="Close this card" placement="bottom">
                                    <DeleteOutlined onClick={() => { setUser(null), form.resetFields() }} />
                                </Tooltip>,
                                <Tooltip title="Save contact" placement="bottom">
                                    <Dropdown overlay={menu} placement="topCenter">
                                        <SaveOutlined />
                                    </Dropdown>
                                </Tooltip>
                            ]}
                        >
                            <Meta
                                avatar={<Avatar>{`${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`}</Avatar>}
                                title={`${user.firstname} ${user.lastname}`}
                                description={user.company}
                            />
                        </Card>
                        : null
            }
        </div>
    )
};