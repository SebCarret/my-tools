import { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, LinkedinOutlined, UnorderedListOutlined, UserAddOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { CSVDownloader } from 'react-papaparse';
import DbConnect from '../../models/dbConnect';
import leadsModel from '../../models/leads';
import TopMenu from "../../components/TopMenu";
import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import { useSelector } from 'react-redux';

const List = ({ list }) => {

    const router = useRouter();
    const { name } = router.query;

    const lists = useSelector(state => state.lists);

    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isCreateVisible, setIsCreateVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [contactToEdit, setContactToEdit] = useState({});

    useEffect(() => {
        for (let i = 0; i < list.length; i++) {
            list[i].key = i
        };
        const header = ["firstname", "lastname", "company", "domain", "email", "status", "linkedinUrl"]
        let finalHeaders = [];
        for (let title of header) {
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
                        if (url !== undefined && url !== null && url !== "") {
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
        setDatas(list)
    }, [list]);

    const onDeleteClick = async () => {
        let datasCopy = [...datas];
        let contactsToDelete = [];
        for (let row of selectedRows) {
            let userToFind = datasCopy.find(user => user.key === row);
            if (userToFind) {
                contactsToDelete.push(userToFind._id);
                datasCopy = datasCopy.filter(user => user.key !== userToFind.key)
            }
        };
        let data = JSON.stringify(contactsToDelete);
        let request = await fetch('/api/leads', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/Json' },
            body: data
        })
        let response = await request.json();
        if (response.success) {
            setDatas(datasCopy);
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    const onEditClick = () => {
        for (let contact of datas) {
            for (let row of selectedRows) {
                if (contact.key === row) {
                    setContactToEdit(contact)
                }
            }
        };
        setIsEditVisible(true)
    };

    const confirmUpdating = async (contact) => {

        let user = JSON.stringify(contact);
        let request = await fetch('/api/leads', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/Json' },
            body: user
        });
        let response = await request.json();
        if (response.success) {
            message.success('Contact updated !')
            let datasCopy = [...datas];
            for (let i = 0; i < datasCopy.length; i++) {
                if (datasCopy[i].key === contact.key) {
                    datasCopy[i] = contact
                }
            };
            setDatas(datasCopy)
        } else {
            message.error('Error while updating... Please try again')
        }
    };

    const addContact = contact => {
        let datasCopy = [...datas];
        contact.key = datasCopy.length;
        console.log(contact);
        datasCopy.push(contact);
        setDatas(datasCopy)
    };

    const handleCreateModal = isVisible => setIsCreateVisible(isVisible);

    const handleEditModal = isVisible => setIsEditVisible(isVisible);

    const onSelectChange = rows => {
        setSelectedRows(rows)
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };

    const handleListChange = async e => {
        let list = e.key;
        if (list === name) {
            message.error(`You're already in ${name} list...`)
        } else {
            let datasCopy = [...datas];
            let usersToMove = [];
            for (let row of selectedRows) {
                let userToFind = datasCopy.find(user => user.key === row);
                if (userToFind) {
                    usersToMove.push({
                        id: userToFind._id,
                        list
                    });
                    datasCopy = datasCopy.filter(user => user.key !== userToFind.key)
                }
            };
            let data = JSON.stringify(usersToMove);
            let request = await fetch('/api/list/change', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/Json' },
                body: data
            });
            let response = await request.json();
            if (response.success) {
                message.success(`Contacts moved to ${list} list !`);
                setDatas(datasCopy)
            } else {
                message.error(response.error)
            }
            setSelectedRows([]);
        }
    }

    const menu = (
        <Menu onClick={handleListChange}>
            {
                lists.map(list => {
                    return (
                        <Menu.Item key={list}>
                            {`${list} list`}
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TopMenu />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}>
                    <h2 style={{ marginBottom: 0, marginRight: 10 }}>Selected list : {name}</h2>
                    <CSVDownloader
                        data={datas}
                        // type="button"
                        filename={`${name}-list`}
                    >
                        <Button
                            icon={<DownloadOutlined />}
                        >
                            Download list in CSV
                        </Button>
                    </CSVDownloader>
                </div>
                <div style={{ width: '100%', marginBottom: 25, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        style={{ marginRight: 5 }}
                        onClick={() => setIsCreateVisible(true)}
                    >
                        Create contact
                    </Button>
                    <Dropdown.Button
                        overlay={menu}
                        disabled={selectedRows.length === 0 ? true : false}
                        icon={<UnorderedListOutlined />}
                        placement="topLeft"
                        style={{ marginRight: 5 }}
                    >
                        Move to
                    </Dropdown.Button>
                    <Button
                        icon={<EditOutlined />}
                        disabled={selectedRows.length !== 1 ? true : false}
                        style={{ marginRight: 5 }}
                        onClick={onEditClick}
                    >
                        Update contact
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        disabled={selectedRows.length === 0 ? true : false}
                        style={{ marginRight: 5 }}
                        danger
                        onClick={onDeleteClick}
                    >
                        {
                            selectedRows.length <= 1
                                ? 'Delete contact'
                                : `Delete ${selectedRows.length} contacts`
                        }
                    </Button>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={datas} />
            </div>
            <EditModal isModalVisible={isEditVisible} showModal={handleEditModal} contact={contactToEdit} confirmUpdating={confirmUpdating} />
            <CreateModal isModalVisible={isCreateVisible} showModal={handleCreateModal} listName={name} addContact={addContact} lists={lists} />
        </div>
    )
};

export async function getServerSideProps({ params }) {
    await DbConnect();
    const list = await leadsModel.find({ list: params.name });
    const leads = list.map(lead => {
        const contact = lead.toObject();
        contact._id = contact._id.toString();
        return contact
    })
    return {
        props: { list: leads }
    }
}

export default List;