import TopMenu from '../components/TopMenu';

export default function Account(){
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <TopMenu />
            <h1>My account</h1>
        </div>
    )
}