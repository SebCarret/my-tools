import { useState } from 'react';
import { Select, message, Table, Tag, Button } from 'antd';
import { LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import styles from '../styles/email-finder.module.css';
import { useSelector } from 'react-redux';

const { Option } = Select;

export default function sendEmailFromList() {

    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [template, setTemplate] = useState('');

    const lists = useSelector(state => state.lists);

    const handleSelection = async value => {
        setLoading(true);
        let request = await fetch(`/api/list/load?list=${value}`);
        let response = await request.json();
        if (response.success) {
            const headers = ["firstname", "lastname", "company", "domain", "email", "status", "linkedinUrl"]
            let finalHeaders = [];
            for (let title of headers) {
                if (title === "status") {
                    finalHeaders.push({
                        title: title,
                        dataIndex: title,
                        key: title,
                        render: status => {
                            let color;
                            let emailStatus;
                            switch (status) {
                                case 'valid':
                                    color = 'green';
                                    emailStatus = 'valid';
                                    break;
                                case 'unverified':
                                    color = 'red';
                                    emailStatus = 'unverified'
                                    break;
                                case 'invalid':
                                    color = 'red';
                                    emailStatus = 'invalid'
                                    break;
                                case 'unknown':
                                    color = 'orange';
                                    emailStatus = 'unknown'
                                    break;
                                default:
                                    emailStatus = 'No email'
                            }
                            return (<Tag color={color}>{emailStatus}</Tag>)
                        }
                    })
                } else if (title === "linkedinUrl") {
                    finalHeaders.push({
                        title: "LinkedIn URL",
                        dataIndex: title,
                        key: title,
                        render: url => {
                            if (url) {
                                return (<a href={url} target="_blank"><LinkedinOutlined style={{ fontSize: 20, color: "#676767" }} /></a>)
                            }
                        }
                    })
                } else {
                    finalHeaders.push({
                        title: title,
                        dataIndex: title,
                        key: title
                    })
                }
            };
            setColumns(finalHeaders);
            for (let i = 0; i < response.list.length; i++) {
                response.list[i].key = i
            };
            setDatas(response.list)
        } else {
            message.error(response.message)
        };
        setLoading(false)
    };

    const chooseTemplate = value => {
        value === 'first' ? setTemplate('template_tc8hq0b') : setTemplate('template_jvzhQ1xP')
    };

    const sendEmail = async () => {
        setIsLoading(true);
        let timeOut = selectedRows.length * 1000;
        const emailjs = (await import('emailjs-com')).default;
        let datasCopy = [...datas];
        for (let row of selectedRows) {
            const receiver = datasCopy.find(e => e.key === row);
            if (receiver) {
                let template_params = {
                    firstname: receiver.firstname,
                    company: receiver.company,
                    email: receiver.email,
                    reply_to: process.env.NEXT_PUBLIC_EMAIL_SENDER
                };
                setTimeout(() => {
                    emailjs.send('ovh', template, template_params, process.env.NEXT_PUBLIC_EMAILJS_ID)
                        .then(response => console.log(response), error => console.log('FAILED...', error))
                }, 1000)
            }
        };
        setTimeout(() => {
            setIsLoading(false);
            message.info('Emails were successfully sent to your contacts !');
        }, timeOut);
    };

    const onSelectChange = rows => {
        setSelectedRows(rows)
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };

    return (
        <div id={styles.listSearchContainer}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '50%', marginBottom: 20 }}>
                <Select
                    defaultValue="Please select a list"
                    loading={loading}
                    style={{ width: 200, marginRight: 5 }}
                    onChange={handleSelection}
                >
                    {
                        lists.map(name => {
                            return (<Option value={name}>{name}</Option>)
                        })
                    }
                </Select>
                <Select
                    defaultValue="Select your template"
                    disabled={selectedRows.length < 1 ? true : false}
                    style={{ width: 200, marginRight: 5 }}
                    onChange={chooseTemplate}
                >
                    <Option value="first">First mail</Option>
                    <Option value="second">Follow up</Option>
                </Select>
                <Button
                    icon={<MailOutlined />}
                    disabled={selectedRows.length < 1 ? true : false}
                    loading={isLoading}
                    style={antStyles.button}
                    onClick={sendEmail}
                >
                    {isLoading ? 'Processing...' : 'Send email'}
                </Button>
            </div>

            {
                datas.length === 0
                    ? null
                    : <Table columns={columns} dataSource={datas} rowSelection={rowSelection} bordered />
            }
        </div>
    )
};

const antStyles = {
    button: { marginRight: 5 }
};