import request from 'sync-request';

export default function getInfos(req, res) {

    const datas = JSON.stringify(req.body);
    console.log(datas);

    try {
        new Promise(async (resolve, reject) => {
            let firstRequest = await request('POST', 'https://api.dropcontact.io/batch', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': process.env.DROPCONTACT_APIKEY
                },
                body: datas
            });
            let firstResponse = await JSON.parse(firstRequest.getBody());
            console.log(firstResponse);
            if (firstResponse.success) {
                setTimeout(() => {
                    resolve(firstResponse.request_id)
                }, 30000)
            } 
        })
            .then(async value => {
                let getRequest = await request('GET', `https://api.dropcontact.io/batch/${value}`, {
                    headers: {
                        'X-Access-Token': process.env.DROPCONTACT_APIKEY
                    }
                });
                let getResponse = await JSON.parse(getRequest.getBody());
                console.log(getResponse);
                getResponse.success
                    ? res.status(200).json({ success: true, datas: getResponse.data })
                    : res.status(200).json({ success: false, error: getResponse.reason })
            })
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
}