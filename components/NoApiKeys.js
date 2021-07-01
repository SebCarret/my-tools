import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from 'next/link';
import styles from "../styles/email-finder.module.css";
import TopMenu from "./TopMenu";

export default function noApiKeys({ adminId, tool, provider }) {

    let url;
    switch (provider) {
        case 'Hunter':
            url = 'https://help.hunter.io/en/articles/1970978-what-is-and-where-i-can-find-my-api-secret-key'
            break;
        case 'Dropcontact':
            url = 'https://support.dropcontact.io/article/156-comment-utiliser-lapi-dropcontact'
            break;
        case 'EmailJS':
        url = 'https://www.emailjs.com/docs/sdk/installation/'
    }

    return (
        <div id={styles.container}>
            <TopMenu />
            <div id={styles.topContent}>
                <div id={styles.titleContainer}>
                    <h2 id={styles.title}>Sorry, something's missing...</h2>
                </div>
                <p>To use our {tool} tool, you need to <strong>set an API key in your settings</strong>, provided by your {provider} account.</p>
                <p>Please read <a href={url} target="_blank">the {provider} documentation</a> to get it.</p>
            </div>
            <Link href={`/account/${adminId}`}>
                <Button size="large" type="primary" icon={<ArrowRightOutlined />}>Go to your settings</Button>
            </Link>
        </div>
    )
};
