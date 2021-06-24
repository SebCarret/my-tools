import { useState } from 'react';
import { Modal, Form, Select, Input, Button, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default function createModal({ isModalVisible, showModal, listName, addContact, lists }) {

    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const onSelect = value => form.setFieldsValue({list: value});

    const onFinish = async (values) => {

        setLoading(true);
        if (values.email) values.status = "unverified";

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
            title="Create new contact"
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
                    label="Firsname"
                    rules={[
                        {
                            required: true,
                            message: 'Firstname is required'
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
                    label="Lastname"
                    rules={[
                        {
                            required: true,
                            message: 'Lastname is required'
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
                    label="Company"
                    rules={[
                        {
                            required: true,
                            message: 'Company name is required'
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
                    label="Website"
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
                    label="LinkedIn URL"
                >
                    <Input
                        size="large"
                        placeholder="linkedin.com/in/john-doe/"
                    />
                </FormItem>

                <FormItem
                    name="list"
                    label="List to save"
                    rules={[
                        {
                            required: true,
                            message: "Please select a list"
                        }
                    ]}
                >
                    <Select
                        size="large"
                        defaultValue="Select a list"
                        style={{ width: 192 }}
                        onChange={onSelect}
                    >
                        {
                            lists.map(name => {
                                return (
                                    <Option value={name}>{name}</Option>
                                )
                            })
                        }
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
                        Save
                    </Button>
                </FormItem>
            </Form>
        </Modal>
    )
}