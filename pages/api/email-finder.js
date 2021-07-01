import request from 'sync-request';

const emailFinder = async (req, res) => {

    const { body: { domain, firstname, lastname, company, apiKey } } = req;

    let url;
    domain === undefined
        ? url = `https://api.hunter.io/v2/email-finder?company=${company}&first_name=${firstname}&last_name=${lastname}&api_key=${apiKey}`
        : url = `https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${firstname}&last_name=${lastname}&api_key=${apiKey}`
    try {
        const hunterRequest = await request('GET', url);
        const hunterResponse = await JSON.parse(hunterRequest.getBody());
        let emailStatus;
        switch (hunterResponse.data.verification.status){
            case "valid":
                emailStatus = "valid"
            break;
            case "unknown":
                emailStatus = "unknown"
            break;
            case "accept_all":
                emailStatus = "unverified"
            break;
        };
        let userInfos = {
            email: hunterResponse.data.email,
            status: emailStatus,
            score: hunterResponse.data.score,
            linkedinUrl: hunterResponse.data.linkedin_url
        }
        res.status(200).json({ success: true, userInfos })
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
};

export default emailFinder;