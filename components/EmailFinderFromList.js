import { useState } from 'react';
import { Select, message, Table, Button, Tag } from 'antd';
import { LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import styles from '../styles/email-finder.module.css';
import { useSelector } from 'react-redux';

const { Option } = Select;

export default function EmailFinderFromList({ credits, minusCredits, apiSelected, hunterApiKey, dropcontactApiKey }) {

    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

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

    const findEmailWithHunter = async () => {
        setIsLoading(true);
        let datasCopy = [...datas];
        let emailsFound = 0;
        for (let row of selectedRows) {
            let leadToFind = datasCopy.find(contact => contact.key === row);
            if (leadToFind) {
                let obj = {
                    firstname: leadToFind.firstname,
                    lastname: leadToFind.lastname,
                    apiKey: hunterApiKey
                };
                leadToFind.domain ? obj.domain = leadToFind.domain : obj.company = leadToFind.company;
                let request = await fetch('/api/email-finder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/Json' },
                    body: JSON.stringify(obj)
                })
                let response = await request.json();
                if (response.success) {
                    leadToFind.email = response.userInfos.email;
                    leadToFind.status = response.userInfos.status;
                    leadToFind.linkedinUrl = response.userInfos.linkedinUrl;
                }
                if (leadToFind.email) {
                    let updateRequest = await fetch('/api/leads', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/Json' },
                        body: JSON.stringify(leadToFind)
                    });
                    let updateResponse = await updateRequest.json();
                    if (updateResponse.success) {
                        emailsFound++;
                        datasCopy[row] = leadToFind;
                        setDatas(datasCopy);
                        setSelectedRows([])
                    }
                }
            }
        };
        minusCredits(credits - emailsFound);
        setIsLoading(false);
        if (emailsFound === 0) {
            message.error('No email found for these contacts sorry...')
        } else {
            message.success(`We found ${emailsFound} emails !`)
        }
    };

    const findEmailWithDropcontact = () => {
        let datasCopy = [...datas];
        setIsLoading(true);
        let emailsFound = 0;
        let emailsToFind = [];
        for (let row of selectedRows) {
            let leadToFind = datasCopy.find(contact => contact.key === row);
            if (leadToFind) {
                let obj = {
                    first_name: leadToFind.firstname,
                    last_name: leadToFind.lastname,
                    company: leadToFind.company,
                    apiKey: dropcontactApiKey
                };
                if (leadToFind.domain) obj.domain = leadToFind.domain;
                emailsToFind.push(obj);
            }
        };
        new Promise(async (resolve, reject) => {
            let datasToFetch = JSON.stringify({
                data: emailsToFind,
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
                    let getRequest = await fetch(`/api/data-enrich?requestId=${id}&apiKey=${dropcontactApiKey}`);
                    let getResponse = await getRequest.json();
                    if (getResponse.success) {
                        for (let lead of getResponse.datas) {
                            let leadToEnrich = datasCopy.find(e => e.lastname === lead.last_name);
                            if (leadToEnrich && lead.email) {
                                emailsFound++;
                                leadToEnrich.email = lead.email[0].email;
                                leadToEnrich.status = "unverified";
                                if (lead.linkedin) leadToEnrich.linkedinUrl = `https://${lead.linkedin}`;
                                if (lead.website) leadToEnrich.domain = lead.website;
                                const index = datasCopy.indexOf(leadToEnrich);
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
                        if (emailsFound === 0) {
                            message.error('No LinkedIn profiles found for these contacts sorry...')
                        } else {
                            message.success(`We found ${emailsFound} emails with ${apiSelected} API !`)
                        }
                    } else {
                        message.error(getResponse.error)
                    };
                    setIsLoading(false);
                }, 35000)
            })
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
                    style={antStyles.select}
                    onChange={handleSelection}
                >
                    {
                        lists.map(name => {
                            return (<Option value={name}>{name}</Option>)
                        })
                    }
                </Select>
                <Button
                    icon={<MailOutlined />}
                    disabled={selectedRows.length < 1 ? true : false}
                    loading={isLoading}
                    onClick={apiSelected === 'Hunter' ? findEmailWithHunter : findEmailWithDropcontact}
                >
                    {isLoading ? 'Processing...' : 'Search email'}
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