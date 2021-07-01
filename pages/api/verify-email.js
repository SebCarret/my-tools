import request from 'sync-request';

const emailVerify = async (req, res) => {

    try {
        const hunterRequest = await request('GET', `https://api.hunter.io/v2/email-verifier?email=${req.query.email}&api_key=${req.query.apiKey}`);
        const hunterResponse = await JSON.parse(hunterRequest.getBody());
        let emailStatus;

        switch (hunterResponse.data.status){
            case 'valid':
                emailStatus = 'valid';
            break;
            case 'invalid':
                emailStatus = 'invalid';
            break;
            case 'accept_all':
                emailStatus = 'unknown';
            break;
            case 'webmail':
                emailStatus = 'unknown';
            break;
            case 'disposable':
                emailStatus = 'unknown';
            break;
            case 'unknown':
                emailStatus = 'unknown';
            break;
        };

        res.status(200).json({ success: true, status: emailStatus, result: hunterResponse.data.result, score: hunterResponse.data.score })
    } catch(error){
        res.status(400).json({ success: false, error })
    }
};

export default emailVerify;