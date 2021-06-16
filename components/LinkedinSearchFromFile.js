import { useState } from 'react';
import { Button, Tag, Table, message, Dropdown, Menu } from 'antd';
import { UserOutlined, LinkedinOutlined, UnorderedListOutlined } from '@ant-design/icons';
import styles from '../styles/linkedin-tools.search.module.css';
import UploadFile from './UploadFile';
// import EmailFinderModal from './EmailFinderModal';

const { CheckableTag } = Tag;

export default function LinkedinSearchFromFile({ credits, minusCredits }) {

    const [tempColumns, setTempColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [datasToRead, setDatasToRead] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    // const [selectedLeads, setSelectedLeads] = useState([]);

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

    const onFindProfilesClick = async () => {
        let datasCopy = [...datasToRead];
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
            minusCredits(credits - response.datas.length);
            for (let lead of response.datas) {
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
                }
            };
            let columnsCopy = [...columns];
            columnsCopy.push({
                title: 'linkedinUrl',
                dataIndex: 'linkedinUrl',
                key: 'linkedinUrl',
                render: url => {
                    if (url !== undefined && url !== null && url !== "") {
                        return (<a href={url} target="_blank"><LinkedinOutlined style={{ fontSize: 20, color: "#676767" }} /></a>)
                    }
                }
            });
            setColumns(columnsCopy)
            setDatasToRead(datasCopy);
            setSelectedRows([])
            setIsLoading(false);
            setIsSaving(true);
            if (profilesFound === 0) {
                message.error('No LinkedIn profiles found for these contacts sorry...')
            } else {
                message.success(`We found ${profilesFound} LinkedIn profiles !`)
            }
        };
    };

    const saveProfiles = async (e) => {
        let datasCopy = [...datasToRead];
        let saveCount = 0;
        for (let row of selectedRows) {
            let leadToFind = datasCopy.find(e => e.key === row);
            if (leadToFind) {
                leadToFind.list = e.key;
                console.log(leadToFind);
                let request = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/Json' },
                    body: JSON.stringify(leadToFind)
                });
                let response = await request.json();
                console.log(response);
                if (response.success){
                    saveCount++
                }
            }
        };
        if(saveCount === selectedRows.length){
            message.success('Contacts successfully saved !');
            setIsSaving(false)
        }
    }

    const menu = (
        <Menu onClick={saveProfiles}>
            <Menu.Item key="CEO">CEO list</Menu.Item>
            <Menu.Item key="CTO">CTO list</Menu.Item>
        </Menu>
    );

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
                    : <div id={styles.uploadTableContainer}>
                        <div style={{ display: 'flex' }}>
                            <Button
                                icon={<UserOutlined />}
                                disabled={selectedRows.length < 1 ? true : false}
                                loading={isLoading}
                                style={antStyles.button}
                                onClick={onFindProfilesClick}
                            >
                                {isLoading ? "Processing..." : "Find profile"}
                            </Button>
                            <Dropdown.Button
                                overlay={menu}
                                icon={<UnorderedListOutlined />}
                                disabled={!isSaving ? true : false}
                                style={antStyles.button}
                            >
                                Save contacts to
                            </Dropdown.Button>

                        </div>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={datasToRead}
                            bordered
                        />
                    </div>
            }
            {/* <EmailFinderModal isModalVisible={isVisible} leads={selectedLeads} showModal={showModal} /> */}
        </div>
    )
};

const antStyles = {
    tags: { marginBottom: 5 },
    button: { marginRight: 5, marginTop: 20, marginBottom: 20 }
};