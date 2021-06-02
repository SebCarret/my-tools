import { useState } from 'react';
import { Badge, Tooltip } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import styles from '../../styles/email-finder.module.css';
import TopMenu from '../../components/TopMenu';
import SingleSearch from '../../components/EmailSingleSearch';
import SearchFromFile from '../../components/EmailFinderFromFile';

export default function Upload({ credits }) {

    const [findCredits, setFindCredits] = useState(credits.searches);
    const [verificationCredits, setVerificationsCredits] = useState(credits.verifications);

    const router = useRouter();
    const { type } = router.query;

    const handleFindCredits = creditsAvailables => {
        if (findCredits > 0) {
            setFindCredits(creditsAvailables)
        }
    };

    return (
        <div id={styles.container}>
            <TopMenu />
            {/* <div style={{ display: 'flex', width: '50%', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#595959', borderRadius: 9, padding: 10, opacity: 0.8 }}>
                <h2 style={{ marginBottom: 0, color: 'white' }}>
                    Hunter credits
                </h2>
                <Badge count={findCredits}>
                    <Tooltip title="Email searches availables">
                        <SearchOutlined style={{ fontSize: 25, color: 'white' }} />
                    </Tooltip>
                </Badge>
                <Badge count={verificationCredits}>
                    <Tooltip title="Email verifications availables">
                        <CheckCircleOutlined style={{ fontSize: 25, color: 'white' }} />
                    </Tooltip>
                </Badge>
                <Tooltip title="Credits reset date">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ fontSize: 25, color: 'white' }} />
                        <p style={{ marginBottom: 0, marginLeft: 10, color: 'white' }}>{credits.date}</p>
                    </div>
                </Tooltip>
            </div> */}
            <div id={styles.topContent}>
                <div id={styles.titleContainer}>
                    <h2 id={styles.title}>
                        {
                            type === 'single'
                                ? 'Single search'
                                : 'Upload a file'
                        }
                    </h2>
                    <Badge count={findCredits}>
                        <Tooltip title={`Credits availables until ${credits.date}`}>
                            <SearchOutlined id={styles.searchPicto} />
                        </Tooltip>
                    </Badge>
                </div>
                <p>
                    {
                        type === 'single'
                            ? 'Find a professional email with firstname, lastname and domain (or company name).'
                            : 'Find emails from a list which must contains at least firstname, lastname, and domain (or company name).'
                    }
                </p>
            </div>

            {
                type === 'single'
                    ? <SingleSearch credits={findCredits} minusCredits={handleFindCredits} />
                    : <SearchFromFile credits={findCredits} minusCredits={handleFindCredits} />
            }
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
                searches: response.data.requests.searches.available - response.data.requests.searches.used,
                verifications: response.data.requests.verifications.available - response.data.requests.verifications.used,
            }
        }
    }
}