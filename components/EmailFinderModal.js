import { List, Modal, Avatar, Tag, Dropdown, Menu, message } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

export default function EmailFinderModal({ isModalVisible, leads, showModal }) {

    const lists = useSelector(state => state.lists);

    const saveToList = async (key, lead) => {
        let list = key;
        lead.list = list;
        let request = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: JSON.stringify(lead)
        });
        let response = await request.json();
        if (response.success) {
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    return (
        <Modal
            visible={isModalVisible}
            footer={null}
            title="Your results"
            onCancel={() => showModal(false)}
            width={800}
        >
            <List
                style={{ width: '100%', backgroundColor: 'white' }}
                bordered
                dataSource={leads}
                renderItem={item => {

                    let avatarStyle;
                    let tagColor;
                    switch (item.status) {
                        case "valid":
                            tagColor = "green";
                            avatarStyle = { backgroundColor: '#389E0D' }
                            break;
                        case "unknown":
                            tagColor = "orange";
                            avatarStyle = { backgroundColor: '#D46B08' }
                            break;
                        case "unverified":
                            tagColor = "red";
                            avatarStyle = { backgroundColor: '#CF1322' }
                            break;
                    };

                    return (
                        <List.Item
                            actions={[
                                <Dropdown.Button
                                    overlay={
                                        <Menu onClick={e => saveToList(e.key, item)}>
                                            {
                                                lists.map(name => {
                                                    return (
                                                        <Menu.Item key={name}>
                                                            {`${name} list`}
                                                        </Menu.Item>
                                                    )
                                                })
                                            }
                                        </Menu>}
                                    icon={<UnorderedListOutlined />}
                                    placement="topLeft"
                                >
                                    Save to
                                </Dropdown.Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={avatarStyle}>{`${item.firstname.charAt(0).toUpperCase()}${item.lastname.charAt(0).toUpperCase()}`}</Avatar>}
                                title={`${item.firstname} ${item.lastname}`}
                                description={item.email}
                            />
                            <div><Tag color={tagColor}>{item.status}</Tag></div>
                        </List.Item>
                    )
                }}
            />
        </Modal>
    )
}