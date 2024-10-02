import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import CalendarComponent from './calendar/CalendarComponent';
import Attendance from './tablecomponents/Attendance';
import OfficerAttendance from './attendance-jpcs/OfficerAttendance';

const { Header, Sider, Content } = Layout;

const LayoutMain = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear authentication state (if applicable)
        localStorage.removeItem('authToken'); // Adjust according to your auth method
        navigate('/login'); // Navigate to login page
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    height: '100vh',
                    padding: 0,
                    background: "#1c305c",
                }}
            >
                <div className="demo-logo-vertical" />

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/main/jpcs-officers']}
                    onClick={({ key }) => {
                        if (key === '/signout') {
                            handleSignOut();
                        } else {
                            navigate(key);
                        }
                    }}
                    style={{
                        padding: 0,
                        background: "#1c305c",
                    }}
                    items={[
                        {
                            key: '/main/jpcs-officers',
                            icon: <UserOutlined />,
                            label: 'JPCS Officers',
                        },
                        {
                            key: '/main/events',
                            icon: <UserOutlined />,
                            label: 'Events',
                        },
                        {
                            key: '/main/attendance',
                            icon: <UserOutlined />,
                            label: 'Attendance',
                        },
                        {
                            key: '/signout',
                            icon: <LogoutOutlined />,
                            label: 'Sign Out',
                        },
                    ]}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: "#1c305c",
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            color: '#FFFFFF',
                        }}
                    />
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 'calc(100vh - 64px)',
                        background: colorBgContainer,
                        borderRadius: '8px',
                    }}
                >
                    <Routes>
                        <Route path="/jpcs-officers" element={<OfficerContent />} />
                        <Route path="/events" element={<EventsContent />} />
                        <Route path="/attendance" element={<AttendanceContent />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

// Content components remain unchanged
function OfficerContent() {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    return (
        <div style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 664,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
        }}>
            <OfficerAttendance/>
        </div>
    );
}

function EventsContent() {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    return (
        <div style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 664,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
        }}>
            <CalendarComponent />
        </div>
    );
}

function AttendanceContent() {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    return (
        <div style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 664,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
        }}>
            <Attendance />
        </div>
    );
}

export default LayoutMain;
