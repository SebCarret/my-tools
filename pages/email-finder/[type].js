import { Badge, Tooltip } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import TopMenu from '../../components/TopMenu';
import SingleSearch from '../../components/EmailSingleSearch';
import UploadFile from '../../components/UploadFile';

export default function Upload({ credits }) {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', minHeight: '100vh' }}>
            <TopMenu />
            <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge count={credits.searches}>
                    <Tooltip title="Email searches availables">
                        <SearchOutlined style={{ fontSize: 25 }} />
                    </Tooltip>
                </Badge>
                <Badge count={credits.verifications}>
                    <Tooltip title="Email verifications availables">
                        <CheckCircleOutlined style={{ fontSize: 25 }} />
                    </Tooltip>
                </Badge>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Credits reset date">
                        <CalendarOutlined style={{ fontSize: 25 }} />
                    </Tooltip>
                    <p style={{ marginBottom: 0, marginLeft: 10 }}>{credits.date}</p>
                </div>
            </div>
            {
                type === 'single'
                ? <SingleSearch />
                : <UploadFile />
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
                searches: response.data.requests.searches.available,
                verifications: response.data.requests.verifications.available,
            }
        }
    }
}