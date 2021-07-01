import { useState } from 'react';
import { Badge, Tooltip } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from '../../styles/email-verif.module.css';
import TopMenu from '../../components/TopMenu';
import SingleVerif from '../../components/EmailSingleVerif';
import FileVerif from '../../components/EmailVerifFromFile';
import ListVerif from '../../components/EmailVerifFromList';
import NoApiKeys from '../../components/NoApiKeys';

export default function Upload({ credits }) {

    const [verificationCredits, setVerificationCredits] = useState(credits.verifications);

    const router = useRouter();
    const { type } = router.query;
    const admin = useSelector(state => state.admin);

    const handleVerifCredits = creditsAvailables => {
        if (verificationCredits > 0) {
            setVerificationCredits(creditsAvailables)
        }
    };

    let title;
    let description;
    let contentToDisplay;

    switch (type) {
        case 'single':
            title = 'Single email verification';
            description = 'Verify an email by filling in the form just below.';
            contentToDisplay = <SingleVerif credits={verificationCredits} minusCredits={handleVerifCredits} hunterApiKey={admin.hunterKey} />
            break;
        case 'upload':
            title = 'Verify emails from file';
            description = 'Verify emails of your choice from an uploaded list.';
            contentToDisplay = <FileVerif credits={verificationCredits} minusCredits={handleVerifCredits} hunterApiKey={admin.hunterKey} />
            break;
        case 'list':
            title = 'Verify emails from your lists';
            description = 'Select contacts from one of your list to verify their emails.';
            contentToDisplay = <ListVerif credits={verificationCredits} minusCredits={handleVerifCredits} hunterApiKey={admin.hunterKey} />
            break;
    }

    if (!admin.hunterKey) {
        return <NoApiKeys adminId={admin._id} tool={"email verification"} provider={"Hunter"} />
    } else {
        return (
            <div id={styles.container}>
                <TopMenu />
                <div id={styles.topContent}>
                    <div id={styles.titleContainer}>
                        <h2 id={styles.title}>{title}</h2>
                        <Badge count={verificationCredits}>
                            <Tooltip title={`Credits availables until ${credits.date}`}>
                                <CheckCircleOutlined id={styles.verifPicto} />
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

    let request = await fetch(`https://api.hunter.io/v2/account?api_key=${process.env.HUNTER_APIKEY}`);
    let response = await request.json();

    return {
        props: {
            credits: {
                date: response.data.reset_date,
                verifications: response.data.requests.verifications.available - response.data.requests.verifications.used,
            }
        }
    }
}