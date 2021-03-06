import { useState } from 'react';
import { Button, Tag, Table, Menu, Dropdown, message } from 'antd';
import { MailOutlined, UnorderedListOutlined } from '@ant-design/icons';
import styles from '../styles/email-finder.module.css';
import UploadFile from './UploadFile';
import EmailFinderModal from './EmailFinderModal';

const { CheckableTag } = Tag;

export default function EMailFinderFromFile({ credits, minusCredits, apiSelected, hunterApiKey, dropcontactApiKey }) {

    const [tempColumns, setTempColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [datasToRead, setDatasToRead] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState([]);

    const handleTempColumns = columns => setTempColumns(columns);

    const handleDatasToRead = datas => setDatasToRead(datas);

    const handleFileRemoving = (data) => {
        setTempColumns([]);
        setColumns([]);
        setDatasToRead([]);
        setSelectedTags([])
    };

    const handleTagSelection = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        setSelectedTags(nextSelectedTags);
        let finalColumns = [];
        for (let tag of nextSelectedTags) {
            const tagToFind = tempColumns.find(e => e === tag);
            if (tagToFind) {
                finalColumns.push({
                    title: tagToFind,
                    dataIndex: tagToFind,
                    key: tagToFind
                })
            }
        };
        setColumns(finalColumns);
    };

    const handleRowsSelection = selectedRowKeys => {
        setSelectedRows(selectedRowKeys)
    };

    const findEmailWithHunter = async () => {
        setIsLoading(true);
        let datasCopy = [...datasToRead];
        let emailsToFind = [];
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
                    obj.email = response.userInfos.email;
                    obj.status = response.userInfos.status;
                    obj.score = response.userInfos.score;
                    obj.linkedinUrl = response.userInfos.linkedinUrl;
                }
                if (obj.email) {
                    emailsToFind.push(obj)
                }
            }
        };
        setSelectedLeads(emailsToFind);
        minusCredits(credits - emailsToFind.length)
        setIsLoading(false);
        if (emailsToFind.length > 0) {
            setIsVisible(true)
        } else {
            message.error('No email found for these contacts sorry...')
        }
    };

    const findEmailWithDropcontact = () => {
        console.log(`API selected : ${apiSelected}, API key : ${dropcontactApiKey}`);
        let datasCopy = [...datasToRead];
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
                if (leadToFind.domain) obj.website = leadToFind.domain;
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
                        let emailsToDisplay = [];
                        for (let lead of getResponse.datas) {
                            let leadToEnrich = datasCopy.find(e => e.lastname === lead.last_name);
                            if (leadToEnrich && lead.email) {
                                emailsFound++;
                                leadToEnrich.email = lead.email[0].email;
                                leadToEnrich.status = "unverified";
                                if (lead.linkedin) {
                                    leadToEnrich.linkedinUrl = `https://${lead.linkedin}`;
                                }
                                if (lead.website) leadToEnrich.domain = lead.website;
                                emailsToDisplay.push(leadToEnrich)
                            }
                        };
                        setSelectedLeads(emailsToDisplay);
                        setSelectedRows([])
                        if (emailsFound === 0) {
                            message.error('No email found for these contacts sorry...')
                        } else {
                            setIsVisible(true)
                        }
                    } else {
                        message.error(getResponse.error)
                    };
                    setIsLoading(false);
                }, 35000)
            })
    };

    const showModal = visible => setIsVisible(visible);

    const rowSelection = {
        selectedRows,
        onChange: handleRowsSelection,
    };

    const tagsList = tempColumns.map((tag, i) => {
        return (
            <CheckableTag
                key={`tag-${i}`}
                checked={selectedTags.indexOf(tag) > -1}
                color={selectedTags.indexOf(tag) > -1 ? "success" : "default"}
                style={antStyles.tags}
                onChange={checked => handleTagSelection(tag, checked)}
            >
                {tag}
            </CheckableTag>
        )
    });

    return (
        <div id={styles.fileSearchContainer}>
            <div id={styles.uploadContainer}>
                <UploadFile handleTempColumns={handleTempColumns} handleDatasToRead={handleDatasToRead} handleFileRemoving={handleFileRemoving} />
                <div id={styles.uploadContent}>
                    {
                        tempColumns.length === 0
                            ? <p id={styles.uploadText}>Upload a file and select required columns.</p>
                            : tagsList
                    }
                </div>
            </div>

            {
                columns.length === 0
                    ? null
                    : <div>
                        <Button
                            icon={<MailOutlined />}
                            disabled={selectedRows.length < 1 ? true : false}
                            loading={isLoading}
                            style={antStyles.emailButton}
                            onClick={apiSelected === "Hunter" ? findEmailWithHunter : findEmailWithDropcontact}
                        >
                            {isLoading ? "Processing..." : "Search email"}
                        </Button>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={datasToRead}
                            bordered
                        />
                    </div>
            }
            <EmailFinderModal isModalVisible={isVisible} leads={selectedLeads} showModal={showModal} />
        </div>
    )
};

const antStyles = {
    tags: { marginBottom: 5 },
    emailButton: { marginRight: 5, marginTop: 20, marginBottom: 20 }
};