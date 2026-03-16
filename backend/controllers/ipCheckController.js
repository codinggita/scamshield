import axios from 'axios';

export const checkIP = async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ message: 'IP address is required. Use ?ip=x.x.x.x' });
    }

    try {
        const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
            params: { ipAddress: ip, maxAgeInDays: 90 },
            headers: {
                Key: process.env.ABUSEIPDB_API_KEY,
                Accept: 'application/json'
            }
        });

        const d = response.data.data;
        const score = d.abuseConfidenceScore;

        return res.status(200).json({
            ipAddress: d.ipAddress,
            countryCode: d.countryCode,
            usageType: d.usageType,
            abuseConfidenceScore: score,
            verdict: score > 50 ? 'Suspicious IP' : 'Safe',
            isTor: d.isTor,
            totalReports: d.totalReports,
            domain: d.domain
        });
    } catch (error) {
        const status = error.response?.status;
        const msg = error.response?.data?.errors?.[0]?.detail || error.message;

        if (status === 422) {
            return res.status(422).json({ message: `Invalid IP address: ${msg}` });
        }
        if (status === 401) {
            return res.status(401).json({ message: 'Invalid AbuseIPDB API key' });
        }
        return res.status(500).json({ message: `Failed to check IP: ${msg}` });
    }
};
