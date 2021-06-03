import DbConnect from '../../../models/dbConnect';
import leadsModel from '../../../models/leads';

export default async function handler(req, res) {

    await DbConnect();

    try {
        const leadsList = await leadsModel.find({ list: req.query.list });
        leadsList.length > 0
            ? res.status(200).json({ success: true, list: leadsList })
            : res.status(400).json({ success: false, message: 'No leads on this list sorry...' })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
};