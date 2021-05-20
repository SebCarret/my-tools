import { Badge, Tooltip } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import UploadFile from '../components/UploadFile';

export default function Upload({ credits }) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', minHeight: '100vh', margin: 20 }}>
            <h1 style={{ marginBottom: 20 }}>Upload your CSV file</h1>
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
            <UploadFile />
        </div>

    )
};

export async function getServerSideProps() {

    console.log(process.env.NEXT_PUBLIC_HUNTER_APIKEY);

    let request = await fetch(`https://api.hunter.io/v2/account?api_key=${process.env.NEXT_PUBLIC_HUNTER_APIKEY}`);
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