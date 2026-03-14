export const fakeScams = [
    {
        _id: 'fake_1',
        identifier: '9876543210',
        scamType: 'OTP Scam',
        description: 'Fake bank call asking OTP',
        createdAt: '2026-03-14T10:00:00.000Z',
        reportedBy: { name: 'System' }
    },
    {
        _id: 'fake_2',
        identifier: '9123456789',
        scamType: 'UPI Fraud',
        description: 'UPI refund scam asking payment request',
        createdAt: '2026-03-14T09:30:00.000Z',
        reportedBy: { name: 'System' }
    },
    {
        _id: 'fake_3',
        identifier: '9012345678',
        scamType: 'Fake Job',
        description: 'Fake job offer asking registration fee',
        createdAt: '2026-03-14T08:15:00.000Z',
        reportedBy: { name: 'System' }
    }
];
