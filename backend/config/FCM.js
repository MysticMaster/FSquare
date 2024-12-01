import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const fcm = JSON.parse(fs.readFileSync(path.resolve('config', 'fsquare_fcm.json'), 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(fcm),
});

export const sendNotification = async (fcmToken, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        token: fcmToken,
    };

    try {
        await admin.messaging().send(message);
        console.log('FCM Notification sent successfully');
    } catch (error) {
        console.error('Error sending FCM notification:', error.message);
    }
};
