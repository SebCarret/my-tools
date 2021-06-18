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
            <SubMenu key="mail" icon={<MailOutlined />} title="Email tools">
                <Menu.ItemGroup title="Email finder">
                    <Menu.Item key="mail:single" icon={<SearchOutlined />}>
                        <Link href="/email-finder/single">Single search</Link>
                    </Menu.Item>
                    <Menu.Item key="mail:upload" icon={<UploadOutlined />}>
                        <Link href="/email-finder/upload">Upload file</Link>
                    </Menu.Item>
                    <Menu.Item key="mail:list" icon={<UnorderedListOutlined />}>
                        <Link href="/email-finder/list">From your lists</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Email verification">
                    <Menu.Item key="verif:single" icon={<SearchOutlined />}>
                        <Link href="/verify-email/single">Single verification</Link>
                    </Menu.Item>
                    <Menu.Item key="verif:upload" icon={<UploadOutlined />}>
                        <Link href="/verify-email/upload">Upload file</Link>
                    </Menu.Item>
                    <Menu.Item key="verif:list" icon={<UnorderedListOutlined />}>
                        <Link href="/verify-email/list">From your lists</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Send email">
                    <Menu.Item key="mailing:single" icon={<MailOutlined />}>
                        <Link href="/mailing/single">Single email</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
            </SubMenu>
            <SubMenu key="linkedin" icon={<LinkedinOutlined />} title="LinkedIn tools">
                <Menu.ItemGroup title="Search profile">
                    <Menu.Item key="linkedin:search" icon={<SearchOutlined />}>
                        <Link href="/linkedin-tools/search/single">Single search</Link>
                    </Menu.Item>
                    <Menu.Item key="linkedin:upload" icon={<UploadOutlined />}>
                        <Link href="/linkedin-tools/search/upload">Upload file</Link>
                    </Menu.Item>
                    <Menu.Item key="linkedin:list" icon={<UnorderedListOutlined />}>
                        <Link href="/linkedin-tools/search/list">From your lists</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Add to network">
                    <Menu.Item key="linkedin:network" icon={<UserAddOutlined />}>
                        <Link href="/linkedin-tools/network/single">Add to network</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
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