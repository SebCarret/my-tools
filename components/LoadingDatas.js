import { LoadingOutlined } from "@ant-design/icons";

export default function loadingDatas(){
    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <LoadingOutlined style={{ fontSize: 50, marginBottom: 25 }} />
            <h1>Loading datas... Please wait</h1>
        </div>
    )
};