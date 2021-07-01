import { useState } from 'react';
import { Badge, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../../../styles/linkedin-tools.search.module.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import TopMenu from '../../../components/TopMenu';
import LinkedinSingleSearch from '../../../components/LinkedinSingleSearch';
import LinkedinSearchFromList from '../../../components/LinkedinSearchFromList';
import LinkedinSearchFromFile from '../../../components/LinkedinSearchFromFile';
import NoApiKeys from '../../../components/NoApiKeys';

export default function LinkedinSearchProfile({ credits }) {

    const [creditsLeft, setCreditsLeft] = useState(credits);

    const router = useRouter();
    const { type } = router.query;
    const admin = useSelector(state => state.admin);

    const handleCredits = creditsAvailables => {
        if (creditsLeft > 0) {
            setCreditsLeft(creditsAvailables)
        }
    };

    let title;
    let description;
    let contentToDisplay;

    switch (type) {
        case 'single':
            title = 'Single LinkedIn profile search';
            description = 'Find a LinkedIn profile with firstname, lastname and company name.';
            contentToDisplay = <LinkedinSingleSearch credits={creditsLeft} minusCredits={handleCredits} dropcontactApiKey={admin.dropcontactKey} />
            break;
        case 'upload':
            title = 'Search Linkedin profiles from a file';
            description = 'Required columns (case sensitive) : firstname, lastname and company.';
            contentToDisplay = <LinkedinSearchFromFile credits={creditsLeft} minusCredits={handleCredits} dropcontactApiKey={admin.dropcontactKey} />
            break;
        case 'list':
            title = 'Search LinkedIn profiles from one your lists';
            description = 'Select contacts from one of your list to find their LinkedIn profile.';
            contentToDisplay = <LinkedinSearchFromList credits={creditsLeft} minusCredits={handleCredits} dropcontactApiKey={admin.dropcontactKey} />
            break;
    }

    if (!admin.dropcontactKey) {
        return <NoApiKeys adminId={admin._id} tool={"LinkedIn profile search"} provider={"Dropcontact"} />
    } else {
        return (
            <div id={styles.container}>
                <TopMenu />
                <div id={styles.topContent}>
                    <div id={styles.titleContainer}>
                        <h2 id={styles.title}>{title}</h2>
                        <Badge count={creditsLeft}>
                            <Tooltip title="Credits availables from your Dropcontact account">
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

export async function getServerSideProps() {

    let request = await fetch('https://api.dropcontact.io/batch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Token': process.env.DROPCONTACT_APIKEY
        },
        body: JSON.stringify({
            data: [{}]
        })
    });
    let response = await request.json();

    return {
        props: {
            credits: response.credits_left
        }
    }

}