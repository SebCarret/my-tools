import { useState } from 'react';
import { Menu } from 'antd';
import {
    UnorderedListOutlined,
    MailOutlined,
    LinkedinOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined,
    UserAddOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link'

const { SubMenu } = Menu;

export default function TopMenu() {

    const [current, setCurrent] = useState('list');

    const menuSelect = e => setCurrent(e.key)

    return (
        <Menu style={styles.menu} onClick={menuSelect} selectedKeys={current} mode="horizontal">
            <SubMenu key="list" icon={<UnorderedListOutlined />} title="Your lists">
                <Menu.Item key="list:CEO">
                    <Link href="/list/CEO">CEO</Link>
                </Menu.Item>
                <Menu.Item key="list:CTO">
                    <Link href="/list/CTO">CTO</Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="mail" icon={<MailOutlined />} title="Find email">
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
            <SubMenu key="verif" icon={<CheckCircleOutlined />} title="Verify email">
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
            <SubMenu key="linkedin" icon={<LinkedinOutlined />} title="LinkedIn tools">
                <Menu.Item key="linkedin:search" icon={<SearchOutlined />}>
                    <Link href="/linkedin-tools/search">Search profile</Link>
                </Menu.Item>
                <Menu.Item key="linkedin:network" icon={<UserAddOutlined />}>
                    <Link href="/linkedin-tools/network">Add to network</Link>
                </Menu.Item>
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