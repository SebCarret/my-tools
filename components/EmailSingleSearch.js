import { useState } from 'react';
import { Form, Input, Select, Button, List, Avatar, Tag, Tooltip, Dropdown, Menu, message, Card } from 'antd';
import { SearchOutlined, CloseCircleOutlined, UnorderedListOutlined, SaveOutlined, DeleteOutlined, LinkedinOutlined } from '@ant-design/icons';
import styles from '../styles/email-finder.module.css';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const { Meta } = Card;

export default function SingleEmailSearch({ credits, minusCredits, apiSelected, hunterApiKey, dropcontactApiKey }) {

    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);
    const [lead, setLead] = useState(null);

    const lists = useSelector(state => state.lists);

    const [form] = Form.useForm();

    const onSelect = value => {
        form.setFieldsValue({ type: value });
        setType(value)

    };

    const findEmailWithHunter = async values => {
        setLoading(true);
        let datas = {
            firstname: values.firstname,
            lastname: values.lastname,
            apiKey: hunterApiKey
        };
        datas[values.type] = values.value;
        let request = await fetch('/api/email-finder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: JSON.stringify(datas)
        })
        let response = await request.json();
        if (response.success) {
            datas.email = response.userInfos.email;
            datas.status = response.userInfos.status;
            // datas.score = response.userInfos.score;
            if (response.userInfos.linkedinUrl) datas.linkedinUrl = response.userInfos.linkedinUrl;
            setLead(datas);
            form.resetFields();
            minusCredits(credits - 1)
        } else {
            message.error(response.error)
        }
        setLoading(false)
    };

    const findEmailWithDropcontact = values => {
        setLoading(true);
        let datas = {
            first_name: values.firstname,
            last_name: values.lastname,
            apiKey: dropcontactApiKey
        }
        values.type === "company" ? datas.company = values.value : datas.website = values.value
        console.log(datas);
        new Promise(async (resolve, reject) => {
            let request = await fetch('/api/data-enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/Json' },
                body: JSON.stringify({
                    data: [datas],
                    siren: "False",
                    language: 'en'
                })
            });
            let response = await request.json();
            if (response.success) {
                minusCredits(response.credits);
                resolve(response.requestId)
            } else {
                message.error(response.error)
            }
        })
            .then(id => {
                setTimeout(async () => {
                    let getRequest = await fetch(`/api/data-enrich?requestId=${id}&apiKey=${dropcontactApiKey}`);
                    let getResponse = await getRequest.json();
                    if (getResponse.success) {
                        if (getResponse.datas[0].email) {
                            values.email = getResponse.datas[0].email[0].email;
                            values.status = "unverified";
                            if (getResponse.datas[0].linkedin) values.linkedinUrl = `https://${getResponse.datas[0].linkedin}`;
                            if (getResponse.datas[0].website) values.domain = getResponse.datas[0].website;
                            setLead(values);
                            form.resetFields()
                        } else {
                            message.error(getResponse.error)
                        };
                    } else {
                        message.error(getResponse.error)
                    }
                    setLoading(false)
                }, 35000)

            })
    };

    const saveToList = async (e) => {
        let list = e.key;
        let leadCopy = { ...lead };
        leadCopy.list = list;
        let request = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: JSON.stringify(leadCopy)
        });
        let response = await request.json();
        if (response.success) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const saveMenu = (
        <Menu onClick={saveToList}>
            {
                lists.map(name => {
                    return (
                        <Menu.Item key={name}>
                            {`${name} list`}
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    );

    console.log(dropcontactApiKey);

    return (

        <div id={styles.container}>
            <Form layout="inline" form={form} onFinish={apiSelected === "Hunter" ? findEmailWithHunter : findEmailWithDropcontact}>
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
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: 'Type is required'
                        }
                    ]}
                >
                    <Select
                        defaultValue="Choose a type"
                        style={antStyles.select}
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
                        placeholder={type === '' || type === "company" ? "Facebook" : "facebook.com"}
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
                        {loading ? 'Processing...' : 'Find email'}
                    </Button>
                </Form.Item>
            </Form>
            {
                lead === null
                    ? null
                    : <Card
                        style={{ width: 300, marginTop: 40 }}
                        actions={[
                            <Tooltip title="Close this card" placement="bottom">
                                <DeleteOutlined onClick={() => setLead(null)} />
                            </Tooltip>,
                            <Tooltip title="Save contact" placement="bottom">
                                <Dropdown overlay={saveMenu} placement="topCenter">
                                    <SaveOutlined />
                                </Dropdown>
                            </Tooltip>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar>{`${lead.firstname.charAt(0).toUpperCase()}${lead.lastname.charAt(0).toUpperCase()}`}</Avatar>}
                            title={`${lead.firstname} ${lead.lastname}`}
                            description={lead.email}
                        />
                    </Card>
            }
        </div>
    )
};

const antStyles = {
    select: { width: 200 },
    list: { width: '66%', marginTop: 40, backgroundColor: 'white' }
};