import { useState } from 'react';
import { Input, Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import TopMenu from '../components/TopMenu';
import Upload from '../components/UploadFile';
import styles from '../styles/create-list.module.css';

const { CheckableTag } = Tag;

export default function createList() {

    const [listName, setListName] = useState('');
    const [tempColumns, setTempColumns] = useState([]);
    const [datasToRead, setDatasToRead] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleTempColumns = columns => setTempColumns(columns);

    const handleDatasToRead = datas => setDatasToRead(datas);

    const handleFileRemoving = (data) => {
        setTempColumns([]);
        setDatasToRead([]);
        setSelectedTags([]);
        setListName('');
    };

    const handleTagSelection = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    const tagsList = tempColumns.map((tag, i) => {
        return (
            <CheckableTag
                key={`tag-${i}`}
                checked={selectedTags.indexOf(tag) > -1}
                style={{ marginBottom: 5 }}
                onChange={checked => handleTagSelection(tag, checked)}
            >
                {tag}
            </CheckableTag>
        )
    });

    const createList = async () => {
        let leadsSaved = 0;
        setLoading(true)
        if (listName === ""){
            message.error("Please enter a name for your list")
        } else {
            dispatch({type: "addNewList", newList: listName});
            for (let contact of datasToRead){
                let lead = {};
                lead.list = listName;
                for (let tag of selectedTags){
                    lead[tag] = contact[tag]
                };
                if (selectedTags.includes("email")){
                    lead.status = "unverified"
                };
                const request = await fetch('/api/leads', {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify(lead)
                });
                const response = await request.json()
                if (response.success) leadsSaved++
            }
            message.success(`${leadsSaved} new contacts saved on your new ${listName} list !`)
        };
        setLoading(false);
    }

    return (
        <div id={styles.container}>
            <TopMenu />
            <div id={styles.topContent}>
                <h2>Create a new list</h2>
                <p>Give it a name, upload a CSV file and select columns you want to save in your list.</p>
            </div>
            <div id={styles.form}>
                <Input placeholder="Your list name" onChange={e => setListName(e.target.value)}/>
                <div id={styles.listUploadContainer}>
                    <div className={styles.listDetails}>
                    <Upload handleTempColumns={handleTempColumns} handleDatasToRead={handleDatasToRead} handleFileRemoving={handleFileRemoving} />
                    </div>
                    <div className={styles.listDetails}>
                        <p>To work with our tools, your file must respect the following rules :</p>
                        <ol>
                            <li className={styles.listRules}>Each column name is <span className={styles.boldText}>case sensitive</span> (respect syntax below).</li>
                            <li className={styles.listRules}><span className={styles.boldText}>Required columns</span>: "firstname", "lastname" and "company name".</li>
                            <li className={styles.listRules}><span className={styles.boldText}>Optional columns</span>: "email", "domain" (company website) and "linkedinUrl" (LinkedIn profile).</li>
                        </ol>
                    </div>
                </div>
                {
                    tempColumns.length === 0
                        ? null
                        : <div id={styles.tagsContainer}>
                            <p className={styles.boldText}>Your files contains {datasToRead.length} contacts. Please select columns you want to save into your list :</p>
                            <div id={styles.tagsList}>
                                {tagsList}
                            </div>
                        </div>
                }
                <Button
                    icon={<PlusOutlined />}
                    loading={loading}
                    disabled={(!selectedTags.includes('firstname') || !selectedTags.includes('lastname') || !selectedTags.includes('company')) ? true : false}
                    onClick={createList}
                >
                    Create list
                </Button>
            </div>
        </div>

    )
};