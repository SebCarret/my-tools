import { useState, useEffect } from 'react';
import { Badge, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from '../../styles/email-finder.module.css';
import TopMenu from '../../components/TopMenu';
import SingleSearch from '../../components/EmailSingleSearch';
import SearchFromFile from '../../components/EmailFinderFromFile';
import SearchFromList from '../../components/EmailFinderFromList';
import NoApiKeys from '../../components/NoApiKeys';

export default function emailFinder() {

    const [findCredits, setFindCredits] = useState(0);
    const [date, setDate] = useState('');

    const router = useRouter();
    const { type } = router.query;
    const admin = useSelector(state => state.admin);

    useEffect(() => {
        const loadCredits = async () => {
            let request = await fetch(`/api/credits/email-finder?apiKey=${admin.hunterKey}`);
            let response = await request.json();
            setFindCredits(response.credits);
            setDate(response.date);
        };
        loadCredits()
    }, []);

    const handleFindCredits = creditsAvailables => {
        if (findCredits > 0) {
            setFindCredits(creditsAvailables)
        }
    };

    let title;
    let description;
    let contentToDisplay;

    switch (type) {
        case 'single':
            title = 'Single email search';
            description = 'Find a professional email with firstname, lastname and domain (or company name).';
            contentToDisplay = <SingleSearch credits={findCredits} minusCredits={handleFindCredits} hunterApiKey={admin.hunterKey} />
            break;
        case 'upload':
            title = 'Find emails from a file';
            description = 'Find emails from a list which must contains at least firstname, lastname, and domain (or company name).';
            contentToDisplay = <SearchFromFile credits={findCredits} minusCredits={handleFindCredits} hunterApiKey={admin.hunterKey} />
            break;
        case 'list':
            title = 'Find emails from your lists';
            description = 'Select contacts from one of your list to find their emails.';
            contentToDisplay = <SearchFromList credits={findCredits} minusCredits={handleFindCredits} hunterApiKey={admin.hunterKey} />
            break;
    }

    if (!admin.hunterKey) {
        return <NoApiKeys adminId={admin._id} tool={"email finder"} provider={"Hunter"} />
    } else {
        return (
            <div id={styles.container}>
                <TopMenu />
                <div id={styles.topContent}>
                    <div id={styles.titleContainer}>
                        <h2 id={styles.title}>{title}</h2>
                        <Badge count={findCredits}>
                            <Tooltip title={`Credits availables until ${date}`}>
                                <SearchOutlined id={styles.searchPicto} />
                            </Tooltip>
                        </Badge>
                    </div>
                    <p>{description}</p>
                </div>
                {contentToDisplay}
            </div>
        )
    }
};