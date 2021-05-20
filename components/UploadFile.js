import { createRef, useState } from 'react';
import { Button, Tag, Table, Menu, Dropdown } from 'antd';
import { UploadOutlined, DeleteOutlined, MailOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { CSVReader } from 'react-papaparse';

const buttonRef = createRef();
const { CheckableTag } = Tag;

export default function UploadFile() {

    const [tempColumns, setTempColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [datasToRead, setDatasToRead] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e);
        }
    };

    const handleOnFileLoad = (data) => {
        let header = data[0].data;
        setTempColumns(header);
        let finalDatas = [];
        for (let i = 1; i < data.length; i++) {
            let obj = {};
            obj.key = i - 1;
            for (let j = 0; j < data[i].data.length; j++) {
                obj[header[j]] = data[i].data[j]
            };
            finalDatas.push(obj)
        };
        setDatasToRead(finalDatas)
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveFile = (data) => {
        setTempColumns([]);
        setColumns([]);
        setDatasToRead([]);
        setSelectedTags([])
    };

    const handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e);
        }
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

    const tagsList = tempColumns.map((tag, i) => {
        return (
            <CheckableTag
                key={`tag-${i}`}
                checked={selectedTags.indexOf(tag) > -1}
                color={selectedTags.indexOf(tag) > -1 ? "success" : "default"}
                onChange={checked => handleTagSelection(tag, checked)}
            >
                {tag}
            </CheckableTag>
        )
    });

    const handleRowsSelection = selectedRowKeys => {
        console.log(selectedRowKeys);
        setSelectedRows(selectedRowKeys)
    };

    const rowSelection = {
        selectedRows,
        onChange: handleRowsSelection,
    };

    const saveToList = (e) => {
        console.log(e.key);
        let list = e.key === "1" ? "CEO" : "CTO";
    }

    const menu = (
        <Menu onClick={saveToList}>
            <Menu.Item key="1">
                CEO
            </Menu.Item>
            <Menu.Item key="2">
                CTO
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: 20, width: '100%' }}>
            <CSVReader
                ref={buttonRef}
                onFileLoad={handleOnFileLoad}
                onError={handleOnError}
                noClick
                noDrag
                onRemoveFile={handleOnRemoveFile}
            >
                {({ file }) => (
                    !file ?
                        <Button
                            icon={<UploadOutlined />}
                            onClick={handleOpenDialog}
                        >
                            Browse file
                        </Button>
                        : <Button
                            icon={<DeleteOutlined />}
                            onClick={handleRemoveFile}
                            danger
                        >
                            {file.name}
                        </Button>
                )}
            </CSVReader>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20, marginBottom: 20 }}>
                {tagsList}
            </div>
            {
                columns.length === 0
                    ? null
                    : <div>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <Dropdown.Button
                                overlay={menu}
                                disabled={selectedRows.length < 1 ? true : false}
                                icon={<UnorderedListOutlined />}
                                placement="topLeft"
                                style={{ marginRight: 5 }}
                            >
                                Move to
                            </Dropdown.Button>
                            <Button
                                icon={<MailOutlined />}
                                disabled={selectedRows.length < 1 ? true : false}
                                style={{ marginRight: 5 }}
                            >
                                Search email
                            </Button>
                        </div>
                        <Table
                            //style={{width: '50%'}}
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