import { useState } from 'react';
import { Button, Tag, Table, Select, message } from 'antd';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import styles from '../styles/email-finder.module.css';
import UploadFile from './UploadFile';

const { CheckableTag } = Tag;
const { Option } = Select;

export default function sendEmailFromFile({ email, emailjsId, templates, adminId }) {

    const [tempColumns, setTempColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [datasToRead, setDatasToRead] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [template, setTemplate] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const router = useRouter();

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
                style={{ marginBottom: 5 }}
                onChange={checked => handleTagSelection(tag, checked)}
            >
                {tag}
            </CheckableTag>
        )
    });

    const chooseTemplate = value => {
        setTemplate(value);
        setButtonDisabled(false)
    };

    const sendEmail = async () => {
        setIsLoading(true);
        let timeOut = selectedRows.length * 1000;
        const emailjs = (await import('emailjs-com')).default;
        let datasCopy = [...datasToRead];
        for (let row of selectedRows) {
            const receiver = datasCopy.find(e => e.key === row);
            if (receiver) {
                let template_params = {
                    firstname: receiver.firstname,
                    company: receiver.company,
                    email: receiver.email,
                    reply_to: email
                };
                setTimeout(() => {
                    emailjs.send('ovh', template, template_params, emailjsId)
                        .then(response => console.log(response), error => console.log('FAILED...', error))
                }, 1000)
            }
        };
        setTimeout(() => {
            setIsLoading(false);
            setButtonDisabled(true);
            message.info('Emails were successfully sent to your contacts !');
        }, timeOut);
    };

    return (
        <div id={styles.fileSearchContainer}>
            <div id={styles.uploadContainer}>
                <UploadFile handleTempColumns={handleTempColumns} handleDatasToRead={handleDatasToRead} handleFileRemoving={handleFileRemoving} />
                <div id={styles.uploadContent}>
                    {
                        tempColumns.length === 0
                            ? <p id={styles.uploadText}>Upload a file and select required columns (which depend on your dynamic variables).</p>
                            : tagsList
                    }
                </div>
            </div>

            {
                columns.length === 0
                    ? null
                    : <div>
                        <div style={{ display: 'flex', marginTop: 20, marginBottom: 20 }}>
                            {
                                templates.length === 0
                                    ? <Button
                                        icon={<SettingOutlined />}
                                        style={{ marginRight: 5 }}
                                        onClick={() => router.push(`/account/${adminId}`)}
                                    >
                                        Set templates
                                    </Button>
                                    : <Select
                                        defaultValue="Select your template"
                                        disabled={selectedRows.length < 1 ? true : false}
                                        style={{ width: 200, marginRight: 5 }}
                                        onChange={chooseTemplate}
                                    >
                                        {
                                            templates.map(id => (
                                                <Option value={id}>{id}</Option>
                                            ))
                                        }
                                    </Select>
                            }
                            <Button
                                type="primary"
                                icon={<MailOutlined />}
                                disabled={buttonDisabled}
                                loading={isLoading}
                                onClick={sendEmail}
                            >
                                {isLoading ? 'Processing...' : 'send email'}
                            </Button>
                        </div>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={datasToRead}
                            bordered
                        />
                    </div>
            }
        </div>
    )
};