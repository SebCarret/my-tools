import { useState, useEffect } from 'react';
import { Badge, Tooltip, Switch } from 'antd';
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
    // const [date, setDate] = useState('');
    const [Api, setApi] = useState('Hunter');

    const router = useRouter();
    const { type } = router.query;
    const admin = useSelector(state => state.admin);

    useEffect(() => {
        const loadCredits = async () => {
            let url = Api === "Hunter" ? `/api/credits/email-finder?apiKey=${admin.hunterKey}` : `/api/credits/enrich-data?apiKey=${admin.dropcontactKey}`;
            let request = await fetch(url);
            let response = await request.json();
            setFindCredits(response.credits);
        };
        loadCredits()
    }, [Api]);

    const handleFindCredits = creditsAvailables => {
        if (findCredits > 0) {
            setFindCredits(creditsAvailables)
        }
    };

    const handleSwitch = checked => checked ? setApi("Dropcontact") : setApi("Hunter");

    let title;
    let description;
    let contentToDisplay;

    switch (type) {
        case 'single':
            title = 'Single email search';
            description = `Find a professional email with ${Api} by entering firstname, lastname and domain (or company name).`;
            contentToDisplay = <SingleSearch credits={findCredits} minusCredits={handleFindCredits} apiSelected={Api} hunterApiKey={admin.hunterKey} dropcontactApiKey={admin.dropcontactKey} />
            break;
        case 'upload':
            title = 'Find emails from a CSV file';
            description = `Find emails with ${Api} by uploadind a list which must contains at least firstname, lastname, and domain (or company name).`;
            contentToDisplay = <SearchFromFile credits={findCredits} minusCredits={handleFindCredits} apiSelected={Api} hunterApiKey={admin.hunterKey} dropcontactApiKey={admin.dropcontactKey} />
            break;
        case 'list':
            title = 'Find emails from your lists';
            description = `Select contacts from one of your list to find their emails with ${Api}.`;
            contentToDisplay = <SearchFromList credits={findCredits} minusCredits={handleFindCredits} apiSelected={Api} hunterApiKey={admin.hunterKey} dropcontactApiKey={admin.dropcontactKey} />
            break;
    };

    if ((Api === "Hunter" && !admin.hunterKey) || (Api === "Dropcontact" && !admin.dropcontactKey)) {
        return <NoApiKeys adminId={admin._id} tool={"email finder"} provider={Api} />
    } else {
        return (
            <div id={styles.container}>
                <TopMenu />
                <div id={styles.topContent}>
                    <div id={styles.titleContainer}>
                        <h2 id={styles.title}>{title}</h2>
                        <Badge count={findCredits}>
                            <Tooltip title={`${Api} : credits availables`}>
                                <SearchOutlined id={styles.searchPicto} />
                            </Tooltip>
                        </Badge>
                        <Switch
                            style={{ marginLeft: 25 }}
                            checkedChildren="Hunter <"
                            unCheckedChildren="> Dropcontact"
                            onChange={handleSwitch}
                        />
                    </div>
                    <p>{description}</p>
                </div>
                {contentToDisplay}
            </div>
        )
    }
};