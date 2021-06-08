import { useState } from 'react';
import { Badge, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import styles from '../../styles/email-finder.module.css';
import TopMenu from '../../components/TopMenu';
import SingleSearch from '../../components/EmailSingleSearch';
import SearchFromFile from '../../components/EmailFinderFromFile';
import SearchFromList from '../../components/EmailFinderFromList';

export default function Upload({ credits }) {

    const [findCredits, setFindCredits] = useState(credits.searches);

    const router = useRouter();
    const { type } = router.query;

    const handleFindCredits = creditsAvailables => {
        if (findCredits > 0) {
            setFindCredits(creditsAvailables)
        }
    };

    let title;
    let description;
    let contentToDisplay;

    switch (type){
        case 'single':
            title = 'Single search';
            description = 'Find a professional email with firstname, lastname and domain (or company name).';
            contentToDisplay = <SingleSearch credits={findCredits} minusCredits={handleFindCredits} />
        break;
        case 'upload':
            title = 'Upload a file';
            description = 'Find emails from a list which must contains at least firstname, lastname, and domain (or company name).';
            contentToDisplay = <SearchFromFile credits={findCredits} minusCredits={handleFindCredits} />
        break;
        case 'list':
            title = 'From your lists';
            description = 'Select contacts from one of your list to find their emails.';
            contentToDisplay = <SearchFromList credits={findCredits} minusCredits={handleFindCredits}/>
        break;
    }

    return (
        <div id={styles.container}>
            <TopMenu />
            <div id={styles.topContent}>
                <div id={styles.titleContainer}>
                    <h2 id={styles.title}>{title}</h2>
                    <Badge count={findCredits}>
                        <Tooltip title={`Credits availables until ${credits.date}`}>
                            <SearchOutlined id={styles.searchPicto} />
                        </Tooltip>
                    </Badge>
                </div>
                <p>{description}</p>
            </div>
            {contentToDisplay}
        </div>

    )
};

export async function getServerSideProps() {

    let request = await fetch(`https://api.hunter.io/v2/account?api_key=${process.env.HUNTER_APIKEY}`);
    let response = await request.json();

    return {
        props: {
            credits: {
                date: response.data.reset_date,
                searches: response.data.requests.searches.available - response.data.requests.searches.used
            }
        }
    }
}