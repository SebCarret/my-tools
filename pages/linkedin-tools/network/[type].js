import { useRouter } from 'next/router';
import TopMenu from '../../../components/TopMenu';
import LinkedinNetwork from '../../../components/LinkedinNetwork';

export default function LinkedinTools() {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TopMenu />
            <LinkedinNetwork />
        </div>
    )
}