import { useState } from 'react';
import { Menu, Button } from 'antd';
import {
    UnorderedListOutlined,
    MailOutlined,
    LinkedinOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined,
    UserAddOutlined,
    CheckCircleOutlined,
    SendOutlined,
    PlusOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';

const { SubMenu } = Menu;

export default function TopMenu() {

    const router = useRouter();

    const [current, setCurrent] = useState('list');
    const lists = useSelector(state => state.lists);

    const menuSelect = e => setCurrent(e.key)

    return (
        <Menu style={styles.menu} onClick={menuSelect} selectedKeys={current} mode="horizontal">
            <SubMenu key="list" icon={<UnorderedListOutlined />} title="Your lists">
                {
                    lists.map(list => {
                        return (
                            <Menu.Item key={`list:${list}`} icon={<UnorderedListOutlined onClick={() => console.log(`clic sur ${list}`)} />}>
                                <Link href={`/list/${list}`}>{list}</Link>
                            </Menu.Item>
                        )
                    })
                }
                <Menu.Item key="list:create">
                    <Button
                        icon={<PlusOutlined />}
                        style={{ width: '100%' }}
                        onClick={() => router.push("/create-list")}
                    >
                        Create list
                    </Button>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="mail" icon={<MailOutlined />} title="Email finder">
                <Menu.Item key="mail:single" icon={<SearchOutlined />}>
                    <Link href="/email-finder/single">Single search</Link>
                </Menu.Item>
                <Menu.Item key="mail:upload" icon={<UploadOutlined />}>
                    <Link href="/email-finder/upload">Upload file</Link>
                </Menu.Item>
                <Menu.Item key="mail:list" icon={<UnorderedListOutlined />}>
                    <Link href="/email-finder/list">From your lists</Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="verif" icon={<CheckCircleOutlined />} title="Email verification">
                <Menu.Item key="verif:single" icon={<SearchOutlined />}>
                    <Link href="/verify-email/single">Single verification</Link>
                </Menu.Item>
                <Menu.Item key="verif:upload" icon={<UploadOutlined />}>
                    <Link href="/verify-email/upload">Upload file</Link>
                </Menu.Item>
                <Menu.Item key="verif:list" icon={<UnorderedListOutlined />}>
                    <Link href="/verify-email/list">From your lists</Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="mailing" icon={<SendOutlined />} title="Send campaign">
                <Menu.Item key="mailing:single" icon={<UserOutlined />}>
                    <Link href="/mailing/single">Single email</Link>
                </Menu.Item>
                <Menu.Item key="mailing:upload" icon={<UploadOutlined />}>
                    <Link href="/mailing/upload">Upload file</Link>
                </Menu.Item>
                <Menu.Item key="mailing:list" icon={<UnorderedListOutlined />}>
                    <Link href="/mailing/list">From your lists</Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="profile" icon={<LinkedinOutlined />} title="LinkedIn profile">
                <Menu.Item key="profile:search" icon={<SearchOutlined />}>
                    <Link href="/linkedin-tools/search/single">Single search</Link>
                </Menu.Item>
                <Menu.Item key="profile:upload" icon={<UploadOutlined />}>
                    <Link href="/linkedin-tools/search/upload">Upload file</Link>
                </Menu.Item>
                <Menu.Item key="profile:list" icon={<UnorderedListOutlined />}>
                    <Link href="/linkedin-tools/search/list">From your lists</Link>
                </Menu.Item>
                {/* <Menu.ItemGroup title="Add to network">
                    <Menu.Item key="linkedin:network" icon={<UserAddOutlined />}>
                        <Link href="/linkedin-tools/network/single">Add to network</Link>
                    </Menu.Item>
                </Menu.ItemGroup> */}
            </SubMenu>
            <Menu.Item key="account" icon={<UserOutlined />}>
                <Link href="/account">Account</Link>
            </Menu.Item>
        </Menu>
    )
}

const styles = {
    menu: {
        width: '100%',
        marginBottom: 25,
        textAlign: 'center'
    }
}