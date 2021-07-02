import request from "sync-request";

const getCredits = async (req, res) => {

    const { provider } = req.query;

    switch (provider) {
        case 'email-finder':
            try {
                const hunterRequest = await request('GET', `https://api.hunter.io/v2/account?api_key=${req.query.apiKey}`);
                const response = await JSON.parse(hunterRequest.body);
                res.status(200).json({ success: true, credits: response.data.requests.searches.available - response.data.requests.searches.used, date: response.data.reset_date })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;

        case 'verify-email':
            try {
                const hunterRequest = await request('GET', `https://api.hunter.io/v2/account?api_key=${req.query.apiKey}`);
                const response = await JSON.parse(hunterRequest.body);
                res.status(200).json({ success: true, credits: response.data.requests.verifications.available - response.data.requests.verifications.used, date: response.data.reset_date })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'linkedin-profile':
            try {
                const dropRequest = await request('POST', 'https://api.dropcontact.io/batch', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': req.query.apiKey
                    },
                    body: JSON.stringify({
                        data: [{}]
                    })
                });
                const response = await JSON.parse(dropRequest.body);
                res.status(200).json({success: true, credits: response.credits_left})
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
};

export default getCredits;