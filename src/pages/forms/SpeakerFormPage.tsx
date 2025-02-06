// src\pages\SpeakerFormPage.tsx
import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Alert, Descriptions } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DASHBOARD_ITEMS } from '../../constants';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

interface Speaker {
    id: string;
    name: string;
    bio: string;
    linkFb: string;
    avatar: string;
    email: string;
    jobTitle: string;
    createdAt: string;
    updatedAt: string;
}

interface ResponseData {
    statusCode: number;
    message: string;
    data: {
        speaker: Speaker;
    };
}

export const SpeakerFormPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: Partial<Speaker>) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const apiEndpoint = 'http://localhost:8080/api/v1/speakers';

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create speaker');
            }

            const responseData: ResponseData = await res.json();
            setResponse(responseData);
            setError(null);
            form.resetFields();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
            setResponse(null);
        } finally {
            setLoading(false);
        }
    };

    
    
    const onFinishFailed = (errorInfo: ValidateErrorEntity<Partial<Speaker>>) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <PageHeader
                title="Speaker Form"
                breadcrumbs={[
                    {
                        title: (
                            <>
                                <HomeOutlined />
                                <span>home</span>
                            </>
                        ),
                        path: '/',
                    },
                    {
                        title: (
                            <>
                                <UserOutlined />
                                <span>speaker</span>
                            </>
                        ),
                        menu: {
                            items: DASHBOARD_ITEMS.map((d) => ({
                                key: d.title,
                                title: <Link to={d.path}>{d.title}</Link>,
                            })),
                        },
                    },
                    {
                        title: 'form',
                    },
                ]}
            />
            <Card title="Create Speaker Form">
                {error && <Alert message={`Error: ${error}`} type="error" showIcon closable onClose={() => setError(null)} />}
                {response && <Alert message={response.message} type="success" showIcon closable onClose={() => setResponse(null)} />}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input speaker name!' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input speaker email!', type: 'email' }]}
                            >
                                <Input placeholder="speaker1@gmail.com" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Job Title"
                                name="jobTitle"
                                rules={[{ required: true, message: 'Please input job title!' }]}
                            >
                                <Input placeholder="AI Expert" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Bio"
                                name="bio"
                                rules={[{ required: true, message: 'Please input bio!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Chuyên gia trong lĩnh vực AI" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            Create Speaker
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {response && response.data.speaker && (
                <Card title="Response Data" style={{ marginTop: '20px' }}>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="ID">{response.data.speaker.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{response.data.speaker.name}</Descriptions.Item>
                        <Descriptions.Item label="Bio">{response.data.speaker.bio}</Descriptions.Item>
                        <Descriptions.Item label="Email">{response.data.speaker.email}</Descriptions.Item>
                        <Descriptions.Item label="Job Title">{response.data.speaker.jobTitle}</Descriptions.Item>
                        <Descriptions.Item label="Facebook Link">{response.data.speaker.linkFb}</Descriptions.Item>
                        <Descriptions.Item label="Avatar URL">
                            <a href={response.data.speaker.avatar} target="_blank" rel="noopener noreferrer">
                                View Avatar
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">{response.data.speaker.createdAt}</Descriptions.Item>
                        <Descriptions.Item label="Updated At">{response.data.speaker.updatedAt}</Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </div>
    );
};

