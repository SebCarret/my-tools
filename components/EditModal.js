import { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const EditModal = ({ isModalVisible, showModal, contact, confirmUpdating }) => {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [company, setCompany] = useState('');
    const [domain, setDomain] = useState('');
    const [email, setEmail] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    useEffect(() => {
        setFirstname(contact.firstname);
        setLastname(contact.lastname);
        setCompany(contact.company);
        setDomain(contact.domain);
        setEmail(contact.email);
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
            key: contact.key,
            status: contact.status,
            linkedinUrl: linkedinUrl
        };
        confirmUpdating(updatedContact);
        showModal(false)
    }

    return (
        <Modal
            title="Modify this contact ?"
            visible={isModalVisible}
            okText="Modify"
            onOk={onConfirmClick}
            cancelText="Cancel"
            onCancel={() => showModal(false)}
        >
            <Input
                placeholder="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Website"
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
                placeholder="LinkedIn URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                style={{ marginBottom: 10 }}
            />
        </Modal>
    )
};

export default EditModal;