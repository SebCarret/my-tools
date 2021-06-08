import { useState } from 'react';
import { Button, Tag, Table, Menu, Dropdown, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import styles from '../styles/email-verif.module.css';
import UploadFile from './UploadFile';
import EmailVerifModal from './EmailVerifModal';

const { CheckableTag } = Tag;

export default function EMailFinderFromFile({ credits, minusCredits }) {

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

    const showModal = visible => setIsVisible(visible);

    const rowSelection = {
        selectedRows,
        onChange: handleRowsSelection,
    };

    const onVerifClick = async () => {
        setIsLoading(true);
        let datasCopy = [...datasToRead];
        let emailsVerified = 0;
        let results = [];
        for (let row of selectedRows){
            let leadToVerif = datasCopy.find(e => e.key === row);
            if (leadToVerif){
                let request = await fetch(`/api/verify-email?email=${leadToVerif.email}`);
                let response = await request.json();
                if (response.success){
                    emailsVerified++;
                    leadToVerif.status = response.status;
                    leadToVerif.score = response.score;
                    console.log(leadToVerif);
                    results.push(leadToVerif)
                }
            }
        };
        setSelectedLeads(results);
        minusCredits(credits - emailsVerified);
        setIsLoading(false);
        setIsVisible(true)
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
        <div id={styles.fileVerifContainer}>
            
            <div id={styles.uploadContainer}>
            <UploadFile handleTempColumns={handleTempColumns} handleDatasToRead={handleDatasToRead} handleFileRemoving={handleFileRemoving} />
                <div id={styles.uploadContent}>
                    {
                        tempColumns.length === 0
                        ? <p id={styles.uploadText}>Upload a file and select at least a column named "email".</p>
                        : tagsList
                    }
                </div>
            </div>

            {
                columns.length === 0
                    ? null
                    : <div id={styles.uploadTableContainer}>
                        <Button
                            icon={<CheckCircleOutlined />}
                            disabled={selectedRows.length < 1 ? true : false}
                            loading={isLoading}
                            style={antStyles.button}
                            onClick={onVerifClick}
                        >
                            Verify email
                        </Button>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={datasToRead}
                            bordered
                        />
                    </div>
            }
            <EmailVerifModal isModalVisible={isVisible} leads={selectedLeads} showModal={showModal} />
        </div>
    )
};

const antStyles = {
    tags: { marginBottom: 5 },
    button: { marginRight: 5, marginTop: 20, marginBottom: 20 }
};