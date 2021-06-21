import { useState } from 'react';
import Link from 'next/link';
import { Select, message, Table, Button, Tag } from 'antd';
import { LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import styles from '../styles/linkedin-tools.search.module.css';

const { Option } = Select;

export default function LinkedinSearchFromList({ credits, minusCredits }) {

    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

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
                            if (url !== undefined && url !== null) {
                                return (<Link href={url} target="_blank"><LinkedinOutlined /></Link>)
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
            let finalDatas = [];
            for (let i = 0; i < response.list.length; i++) {
                if (!response.list[i].linkedinUrl) {
                    finalDatas.push(response.list[i])
                }
            };
            for (let j = 0; j < finalDatas.length; j++) {
                finalDatas[j].key = j
            };
            // setDatas(response.list)
            setDatas(finalDatas)
        } else {
            message.error(response.message)
        };
        setLoading(false)
    };

    const onFindProfilesClick = async () => {
        let datasCopy = [...datas];
        setIsLoading(true);
        let profilesFound = 0;
        let profilesToFind = [];
        for (let row of selectedRows) {
            let leadToFind = datasCopy.find(contact => contact.key === row);
            if (leadToFind) {
                let obj = {
                    first_name: leadToFind.firstname,
                    last_name: leadToFind.lastname,
                    company: leadToFind.company
                };
                profilesToFind.push(obj);
            }
        };
        new Promise(async (resolve, reject) => {
            let datasToFetch = JSON.stringify({
                data: profilesToFind,
                siren: "False",
                language: 'en'
            });
            let request = await fetch('/api/data-enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/Json' },
                body: datasToFetch
            })
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
                    let getRequest = await fetch(`/api/data-enrich?requestId=${id}`);
                    let getResponse = await getRequest.json();
                    if (getResponse.success) {
                        for (let lead of getResponse.datas) {
                            let leadToEnrich = datasCopy.find(e => e.lastname === lead.last_name);
                            if (leadToEnrich && lead.linkedin) {
                                profilesFound++;
                                const index = datasCopy.indexOf(leadToEnrich);
                                leadToEnrich.linkedinUrl = `https://${lead.linkedin}`;
                                // if (lead.email) {
                                //     leadToEnrich.email = lead.email[0].email;
                                //     leadToEnrich.status = "unverified";
                                // }
                                // if (lead.website) leadToEnrich.domain = lead.website;
                                datasCopy[index] = leadToEnrich;
                                let updateRequest = await fetch('/api/leads', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/Json' },
                                    body: JSON.stringify(leadToEnrich)
                                });
                            }
                        };
                        setDatas(datasCopy);
                        setSelectedRows([])
                        if (profilesFound === 0) {
                            message.error('No LinkedIn profiles found for these contacts sorry...')
                        } else {
                            message.success(`We found ${profilesFound} LinkedIn profiles !`)
                        }
                    } else {
                        message.error(getResponse.error)
                    };
                    setIsLoading(false);
                }, 30000)
            })
    }

    const onSelectChange = rows => {
        setSelectedRows(rows)
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };

    return (
        <div id={styles.listSearchContainer}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '50%' }}>
                <Select
                    defaultValue="Please select a list"
                    loading={loading}
                    style={{ width: 200 }}
                    onChange={handleSelection}
                >
                    <Option value="CEO">CEO</Option>
                    <Option value="CTO">CTO</Option>
                </Select>
            </div>

            {
                datas.length === 0
                    ? null
                    : <div>
                        <Button
                            icon={<MailOutlined />}
                            disabled={selectedRows.length < 1 ? true : false}
                            loading={isLoading}
                            style={antStyles.button}
                            onClick={onFindProfilesClick}
                        >
                            Find profiles
                        </Button>
                        <Table columns={columns} dataSource={datas} rowSelection={rowSelection} bordered />
                    </div>
            }
        </div>
    )
};

const antStyles = {
    button: { marginRight: 5, marginTop: 20, marginBottom: 20 }
};