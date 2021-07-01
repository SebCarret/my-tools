import { useState } from 'react';
import { Select, message, Table, Button, Tag } from 'antd';
import { LinkedinOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from '../styles/email-verif.module.css';
import { useSelector } from 'react-redux';

const { Option } = Select;

export default function EmailVerifFromList({ credits, minusCredits, hunterApiKey }) {

    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const lists = useSelector(state => state.lists);

    const handleSelection = async value => {
        setLoading(true);
        let request = await fetch(`/api/list/load?list=${value}&apiKey=${hunterApiKey}`);
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
                                return (<a href={url} target="_blank"><LinkedinOutlined style={antStyles.icon} /></a>)
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

    const onVerifClick = async () => {
        setIsLoading(true);
        let datasCopy = [...datas];
        let emailsVerified = 0;
        for (let row of selectedRows) {
            let leadToFind = datasCopy.find(contact => contact.key === row);
            if (leadToFind) {
                let request = await fetch(`/api/verify-email?email=${leadToFind.email}`);
                let response = await request.json();
                if (response.success) {
                    emailsVerified++;
                    let updateRequest = await fetch('/api/leads', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/Json' },
                        body: JSON.stringify({
                            _id: leadToFind._id,
                            status: response.status
                        })
                    });
                    let updateResponse = await updateRequest.json();
                    if (updateResponse.success) {
                        datasCopy[row].status = response.status;
                        setDatas(datasCopy);
                        setSelectedRows([])
                    }
                }
            }
        };
        minusCredits(credits - emailsVerified);
        setIsLoading(false);
    };

    const onSelectChange = rows => {
        setSelectedRows(rows)
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };

    return (
        <div id={styles.listContainer}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '50%', marginBottom: 20 }}>
                <Select
                    defaultValue="Please select a list"
                    loading={loading}
                    style={antStyles.select}
                    onChange={handleSelection}
                >
                    {
                        lists.map(name => {
                            return <Option value={name}>{name}</Option>
                        })
                    }
                </Select>
                <Button
                    icon={<CheckCircleOutlined />}
                    disabled={selectedRows.length < 1 ? true : false}
                    loading={isLoading}
                    style={antStyles.emailButton}
                    onClick={onVerifClick}
                >
                    Verify email
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
    select: { width: 200, marginRight: 5 },
    icon: { fontSize: 20, color: "#676767" }
};
