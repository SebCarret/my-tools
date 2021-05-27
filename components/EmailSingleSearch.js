import { useState } from 'react';
import { Form, Input, Select, Button, List, Avatar, Tag, Tooltip, Dropdown, Menu, message } from 'antd';
import { SearchOutlined, CloseCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

const Option = Select.Option;

const fakeDatas = [
    {
        firstname: 'Louis',
        lastname: 'Frupel',
        email: 'louis@facebook.com',
        status: 'valid',
        score: 90
    },
    {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@facebook.com',
        status: 'unknown',
        score: 70
    },
    {
        firstname: 'Kiki',
        lastname: 'Kissonlésnorki',
        email: 'kiki@facebook.com',
        status: 'unverified',
        score: 50
    }
];

export default function SingleEmailSearch({credits, minusCredits}) {

    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);
    const [lead, setLead] = useState([]);

    const [form] = Form.useForm();

    const onSelect = value => {
        form.setFieldsValue({ type: value });
        setType(value)

    };

    const findEmail = async values => {
        setLoading(true);
        let datas = {
            firstname: values.firstname,
            lastname: values.lastname,
            // email: "john.doe@facebook.com",
            // status: "valid",
            // score: 95
        };
        datas[values.type] = values.value;
        let request = await fetch('/api/email-finder', {
            method: 'POST',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify(datas)
        })
        let response = await request.json();
        console.log(response);
        if (response.success){
            datas.email = response.userInfos.email;
            datas.status = response.userInfos.status;
            datas.score = response.userInfos.score;
            datas.linkedinUrl = response.userInfos.linkedinUrl;
            minusCredits()
        } else {
            message.error("Something's wrong with the API call... PLease try again")
        }
        setLead([...lead, datas]);
        setLoading(false)
    };

    const saveToList = async (e) => {
        console.log(e.key);
        let list = e.key === "1" ? "CEO" : "CTO";
        let leadCopy = [...lead];
        leadCopy[0].list = list;
        let request = await fetch('/api/leads', {
            method: 'POST',
            headers: {'Content-Type': 'application/Json'},
            body: JSON.stringify(leadCopy[0])
        });
        let response = await request.json();
        if (response.success){
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const saveMenu = (
        <Menu onClick={saveToList}>
            <Menu.Item key="1">
                CEO list
            </Menu.Item>
            <Menu.Item key="2">
                CTO list
            </Menu.Item>
        </Menu>
    );

    return (

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Form layout="inline" form={form} onFinish={findEmail}>
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
                        size="large"
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
                        size="large"
                        placeholder="Doe"
                    />
                </Form.Item>
                <Form.Item
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: 'Type is required'
                        }
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue="Choose a type"
                        style={{ width: 198 }}
                        onChange={onSelect}
                    >
                        <Option value="domain">Website</Option>
                        <Option value="company">Company name</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="value"
                    rules={[
                        {
                            required: true,
                            message: 'This value is required'
                        }
                    ]}
                >
                    <Input
                        disabled={type === '' ? true : false}
                        size="large"
                        placeholder={type === '' || type === "company" ? "Facebook" : "facebook.com"}
                    />
                </Form.Item>
                <Form.Item
                // style={{ marginTop: 48 }}
                >
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        icon={<SearchOutlined />}
                        loading={loading}
                        disabled={credits === 0 ? true : false}
                    >
                        Find email
                    </Button>
                </Form.Item>
            </Form>
            {
                lead.length === 0
                    ? null
                    : <List
                        style={{ width: '66%', marginTop: 40, backgroundColor: 'white' }}
                        bordered
                        dataSource={lead}
                        renderItem={item => {

                            let avatarStyle;
                            let tagColor;
                            // item.score < 80 ? avatarStyle = {backgroundColor: '#f50'} : avatarStyle = {backgroundColor: '#87d068'};
                            switch (item.status){
                                case "valid":
                                    tagColor = "green";
                                    avatarStyle = {backgroundColor: '#389E0D'}
                                break;
                                case "unknown":
                                    tagColor = "orange";
                                    avatarStyle = {backgroundColor: '#D46B08'}
                                break;
                                case "unverified":
                                    tagColor = "red";
                                    avatarStyle = {backgroundColor: '#CF1322'}
                                break;
                            };

                        return (
                            <List.Item
                                actions={[
                                    <Tooltip title="delete this contact">
                                        <CloseCircleOutlined
                                            onClick={() => setLead([])}
                                        />
                                    </Tooltip>,
                                    <Dropdown.Button
                                        overlay={saveMenu}
                                        icon={<UnorderedListOutlined />}
                                        placement="bottomRight"
                                    >
                                        Save to
                                </Dropdown.Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar style={avatarStyle}>{item.score}</Avatar>}
                                    title={`${item.firstname} ${item.lastname}`}
                                    description={item.email}
                                />
                                <div><Tag color={tagColor}>{item.status}</Tag></div>
                            </List.Item>
                        )}}
                    />
            }
        </div>
    )
};