import { useState } from 'react';
import { Divider, Input, Tooltip, Button, message } from 'antd';
import { EditOutlined, CheckOutlined, SaveOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import dbConnect from '../../models/dbConnect';
import adminModel from '../../models/admins';
import TopMenu from '../../components/TopMenu';

export default function Account({ admin }) {

    const [firstname, setFirstname] = useState(admin.firstname);
    const [firstnameLocked, setFirstnameLocked] = useState(true);
    const [lastname, setLastname] = useState(admin.lastname);
    const [lastnameLocked, setLastnameLocked] = useState(true);
    const [email, setEmail] = useState(admin.email);
    const [emailLocked, setEmailLocked] = useState(true);
    const [password, setPassword] = useState('**********************');
    const [pwdLocked, setPwdLocked] = useState(true);
    const [hunterKey, setHunterKey] = useState(admin.hunterKey ? admin.hunterKey : 'API key not set');
    const [hunterLocked, setHunterLocked] = useState(true);
    const [dropKey, setDropKey] = useState(admin.dropcontactKey ? admin.dropcontactKey : 'API key not set');
    const [dropLocked, setDropLocked] = useState(true);
    const [emailjsId, setEmailjsId] = useState(admin.emailjsId ? admin.emailjsId : 'ID not set');
    const [emailjsLocked, setEmailjsLocked] = useState(true);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const saveChanges = async () => {

        setLoading(true);
        
        let datas = { _id: admin._id };
        if (firstname !== admin.firstname) datas.firstname = firstname;
        if (lastname !== admin.lastname) datas.lastname = lastname;
        if (email !== admin.email) datas.email = email;
        if (password !== '**********************') datas.password = password;
        if (hunterKey !== 'API key not set' || (admin.hunterKey && hunterKey !== admin.hunterKey)) datas.hunterKey = hunterKey;
        if (dropKey !== 'API key not set' || (admin.dropcontactKey && hunterKey !== admin.dropcontactKey)) datas.dropcontactKey = dropKey;
        if (emailjsId !== 'ID not set' || (admin.emailjsId && emailjsId !== admin.emailjsId)) datas.emailjsId = emailjsId;

        if (Object.keys(datas).length === 1){
            message.error("Sorry but you didn't change anything...")
        } else {
            let request = await fetch('/api/admin/update', {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(datas)
            });
            let response = await request.json();
            if (response.success){
                localStorage.setItem('admin', JSON.stringify(response.admin));
                dispatch({type: 'update', admin: response.admin});
                message.success(response.message)
            } else {
                message.error(response.error)
            }
        }
        setLoading(false)
    }

    return (
        <div style={styles.container}>
            <TopMenu />
            <h2>Your settings</h2>
            <div style={styles.settings}>
                <Divider orientation="left" style={styles.divider}>Personal infos</Divider>
                <div style={styles.values}>
                    <p style={styles.labels}>Firstname</p>
                    <Input
                        value={firstname}
                        bordered={firstnameLocked ? false : true}
                        disabled={firstnameLocked}
                        suffix={
                            <Tooltip title={firstnameLocked ? "Edit firstname" : "Valid changes"} placement="right">
                                {
                                    firstnameLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setFirstnameLocked(!firstnameLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setFirstnameLocked(!firstnameLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setFirstname(e.target.value)}
                    />
                </div>
                <div style={styles.values}>
                    <p style={styles.labels}>Lastname</p>
                    <Input
                        value={lastname}
                        bordered={lastnameLocked ? false : true}
                        disabled={lastnameLocked}
                        suffix={
                            <Tooltip title={lastnameLocked ? "Edit lastname" : "Valid changes"} placement="right">
                                {
                                    lastnameLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setLastnameLocked(!lastnameLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setLastnameLocked(!lastnameLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setLastname(e.target.value)}
                    />
                </div>
                <div style={styles.values}>
                    <p style={styles.labels}>Email</p>
                    <Input
                        value={email}
                        bordered={emailLocked ? false : true}
                        disabled={emailLocked}
                        suffix={
                            <Tooltip title={emailLocked ? "Edit email" : "Valid changes"} placement="right">
                                {
                                    emailLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setEmailLocked(!emailLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setEmailLocked(!emailLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div style={styles.values}>
                    <p style={styles.labels}>Password</p>
                    <Input
                        value={password}
                        bordered={pwdLocked ? false : true}
                        disabled={pwdLocked}
                        suffix={
                            <Tooltip title={pwdLocked ? "Edit password" : "Valid changes"} placement="right">
                                {
                                    pwdLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setPwdLocked(!pwdLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setPwdLocked(!pwdLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <Divider orientation="left" style={styles.divider}>API keys</Divider>
                <div style={styles.values}>
                    <p style={styles.labels}>Hunter</p>
                    <Input
                        value={hunterKey}
                        bordered={hunterLocked ? false : true}
                        disabled={hunterLocked}
                        suffix={
                            <Tooltip title={hunterLocked ? "Edit API key" : "Valid changes"} placement="right">
                                {
                                    hunterLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setHunterLocked(!hunterLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setHunterLocked(!hunterLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setHunterKey(e.target.value)}
                    />
                </div>
                <div style={styles.values}>
                    <p style={styles.labels}>Dropcontact</p>
                    <Input
                        value={dropKey}
                        bordered={dropLocked ? false : true}
                        disabled={dropLocked}
                        suffix={
                            <Tooltip title={dropLocked ? "Edit API key" : "Valid changes"} placement="right">
                                {
                                    dropLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setDropLocked(!dropLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setDropLocked(!dropLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setDropKey(e.target.value)}
                    />
                </div>
                <div style={styles.values}>
                    <p style={styles.labels}>EmailJS ID</p>
                    <Input
                        value={emailjsId}
                        bordered={emailjsLocked ? false : true}
                        disabled={emailjsLocked}
                        suffix={
                            <Tooltip title={emailjsLocked ? "Edit ID" : "Valid changes"} placement="right">
                                {
                                    emailjsLocked
                                        ? <EditOutlined style={styles.icons} onClick={() => setEmailjsLocked(!emailjsLocked)} />
                                        : <CheckOutlined style={styles.icons} onClick={() => setEmailjsLocked(!emailjsLocked)} />
                                }
                            </Tooltip>
                        }
                        onChange={e => setEmailjsId(e.target.value)}
                    />
                </div>
                <Button
                    style={styles.button}
                    size="large"
                    type="primary"
                    loading={loading}
                    icon={< SaveOutlined />}
                    onClick={saveChanges}
                >
                    Save changes
                </Button>
            </div>
        </div>
    )
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    settings: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '50%' },
    divider: { borderColor: "#23B5D3", color: "#23B5D3" },
    values: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', margin: 5 },
    labels: { fontWeight: 'bold', marginBottom: 0, width: '25%' },
    inputs: { width: '75%' },
    icons: { cursor: 'pointer' },
    button: { marginTop: 25 }
};

export async function getServerSideProps({ params }) {

    await dbConnect();
    const admin = await adminModel.findById(params.id).lean();
    admin._id = admin._id.toString();

    return {
        props: { admin: admin }
    }
}