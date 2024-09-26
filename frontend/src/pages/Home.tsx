import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const HomePage: React.FC = () => {
    const authority = useSelector((state: RootState) => state.auth.authority);
    const admin = useSelector((state: RootState) => state.auth.admin);

    return (
        <div>
            <div>Sidebar with brand, category, shoes management</div>
            <div>Main content area</div>
            <div>Current Authority: {authority}</div> {/* Hiển thị authority ở đây */}

            {admin ? (
                <div>
                    <h2>Admin Information</h2>
                    <img src={admin.avatar} alt={`${admin.firstName}`} style={{ width: '400px', borderRadius: '50%' }} />
                    <p>ID: {admin._id}</p>
                    <p>Name: {admin.lastName} {admin.firstName}</p>
                    <p>Phone: {admin.phone}</p>
                    <p>FCM Token: {admin.fcmToken}</p>
                </div>
            ) : (
                <p>No admin information available.</p>
            )}
            <Link to="/brand">
                <button>Go to Brand Page</button>
            </Link>
        </div>
    );
};

export default HomePage;
