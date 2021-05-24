import { useRouter } from 'next/router';
import TopMenu from '../../components/TopMenu';
import LinkedinSearch from '../../components/LinkedinSearch';
import LinkedinNetwork from '../../components/LinkedinNetwork';

export default function LinkedinTools() {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TopMenu />
            {
                type === 'search'
                    ? <LinkedinSearch />
                    : <LinkedinNetwork />
            }
        </div>
    )
}