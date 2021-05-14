import { useState } from 'react';
import { Modal, Form, Select, Input, Button, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default function createModal({ isModalVisible, showModal, listName, addContact }) {

    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const onSelect = value => form.setFieldsValue({list: value});

    const onFinish = async (values) => {

        setLoading(true);

        let user = JSON.stringify(values);

        let request = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/Json' },
            body: user
        });
        let response = await request.json();
        if (response.success){
            message.success(response.message);
            showModal(false);
            if (values.list === listName){
                addContact(response.contact)
            }
            form.resetFields()
        } else {
            message.error(response.message)
        }
        setLoading(false)
    };

    return (
        <Modal
            title="Créer un nouveau contact"
            visible={isModalVisible}
            footer={null}
            onCancel={() => {
                showModal(false);
                form.resetFields()
            }}
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>

                <FormItem
                    name="firstname"
                    label="Prénom"
                    rules={[
                        {
                            required: true,
                            message: 'Le prénom est obligatoire'
                        }
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="John"
                    />
                </FormItem>

                <FormItem
                    name="lastname"
                    label="Nom"
                    rules={[
                        {
                            required: true,
                            message: 'Le nom est obligatoire'
                        }
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Doe"
                    />
                </FormItem>

                <FormItem
                    name="company"
                    label="Société"
                    rules={[
                        {
                            required: true,
                            message: 'Le nom de la société est obligatoire'
                        }
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Facebook"
                    />
                </FormItem>

                <FormItem
                    name="domain"
                    label="Site web"
                >
                    <Input
                        size="large"
                        placeholder="www.facebook.com"
                    />
                </FormItem>

                <FormItem
                    name="email"
                    label="Email"
                >
                    <Input
                        size="large"
                        placeholder="john.doe@facebook.com"
                    />
                </FormItem>

                <FormItem
                    name="linkedinUrl"
                    label="URL LinkedIn"
                >
                    <Input
                        size="large"
                        placeholder="linkedin.com/in/john-doe/"
                    />
                </FormItem>

                <FormItem
                    name="list"
                    label="Liste du contact"
                    rules={[
                        {
                            required: true,
                            message: "Le choix d'une liste est obligatoire"
                        }
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue="Sélectionne-en une"
                        style={{ width: 192 }}
                        onChange={onSelect}
                    >
                        <Option value="CEO">CEO</Option>
                        <Option value="CTO">CTO</Option>
                    </Select>
                </FormItem>

                <FormItem
                    style={{ marginTop: 48 }}
                >
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Enregistrer
                    </Button>
                </FormItem>
            </Form>
        </Modal>
    )
}