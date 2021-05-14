import DbConnect from '../../models/dbConnect';
import leadsModel from '../../models/leads';

export default async function handler(req, res) {

    await DbConnect();

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
            : res.status(400).json({ success: false, error: 'Erreur lors du transfert de liste... Veuillez réessayer.' })
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
};