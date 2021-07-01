import DbConnect from '../../../models/dbConnect';
import leadsModel from '../../../models/leads';

export default async function listRequest(req, res) {

    const { request } = req.query;

    await DbConnect();

    switch (request) {
        case 'load':
            try {
                const leadsList = await leadsModel.find({ list: req.query.list });
                leadsList.length > 0
                    ? res.status(200).json({ success: true, list: leadsList })
                    : res.status(400).json({ success: false, message: 'No leads on this list sorry...' })
            } catch (error) {
                res.status(400).json({ success: false, message: error })
            }
            break;
        case 'change':
            try {
                let usersUpdated = 0;
                for (let user of req.body){
                    let userToSwitch = await leadsModel.updateOne({ _id: user.id }, { list: user.list });
                    if (userToSwitch.list === req.body.list){
                        usersUpdated++
                    }
                }
                usersUpdated === req.body.length
                    ? res.status(200).json({ success: true, message: 'list updated !' })
                    : res.status(400).json({ success: false, error: 'Erreur during transfer... Please try again.' })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }

}