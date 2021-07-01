import request from 'sync-request';

export default async function getInfos(req, res) {

    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const datas = JSON.stringify(req.body);
                console.log(datas);
                let firstRequest = await request('POST', 'https://api.dropcontact.io/batch', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': req.body.data[0].apiKey
                    },
                    body: datas
                });
                let firstResponse = await JSON.parse(firstRequest.getBody());
                console.log(firstResponse);
                firstResponse.success
                    ? res.status(200).json({ success: true, requestId: firstResponse.request_id, credits: firstResponse.credits_left })
                    : res.status(200).json({ success: false, error: "Your request sent an error... Please try again." })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'GET':
            try {
                let getRequest = await request('GET', `https://api.dropcontact.io/batch/${req.query.requestId}`, {
                    headers: {
                        'X-Access-Token': req.query.apiKey
                    }
                });
                let getResponse = await JSON.parse(getRequest.getBody());
                console.log(getResponse);
                getResponse.success
                    ? res.status(200).json({ success: true, datas: getResponse.data })
                    : res.status(200).json({ success: false, error: getResponse.reason })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
}