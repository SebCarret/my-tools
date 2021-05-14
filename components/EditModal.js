import { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const EditModal = ({ isModalVisible, showModal, contact, confirmUpdating }) => {

    // console.log(contact);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [company, setCompany] = useState('');
    const [domain, setDomain] = useState('');
    const [email, setEmail] = useState('');
    // const [status, setStatus] = useState(contact.status);
    // const [list, setList] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    // const [contactToEdit, setContactToEdit] = useState({});

    useEffect(() => {
        setFirstname(contact.firstname);
        setLastname(contact.lastname);
        setCompany(contact.company);
        setDomain(contact.domain);
        setEmail(contact.email);
        // setList(contact.list);
        setLinkedinUrl(contact.linkedinUrl);
    }, [contact]);

    const onConfirmClick = () => {
        let updatedContact = {
            _id: contact._id,
            firstname: firstname,
            lastname: lastname,
            company: company,
            domain: domain,
            email: email,
            // list: list,
            key: contact.key,
            status: contact.status,
            linkedinUrl: linkedinUrl
        };
        // console.log(updatedContact);
        confirmUpdating(updatedContact);
        showModal(false)
    }

    return (
        <Modal
            title="Modifier ce contact ?"
            visible={isModalVisible}
            okText="Modifier"
            onOk={onConfirmClick}
            cancelText="Annuler"
            onCancel={() => showModal(false)}
        >
            <Input
                placeholder="Prénom"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Nom"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Nom de la société"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Site web"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="URL du profil LinkedIn"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            {/* <Input
                placeholder="Liste"
                value={list}
                onChange={(e) => setList(e.target.value)}
                style={{ marginBottom: 10 }}
            /> */}
        </Modal>
    )
};

export default EditModal;