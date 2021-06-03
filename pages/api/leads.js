import DbConnect from '../../models/dbConnect';
import leadsModel from '../../models/leads';

export default async function handler(req, res) {

    const { method } = req;

    await DbConnect();

    switch (method) {
        case 'PUT':
            try {
                const lead = await leadsModel.updateOne({ _id: req.body._id }, req.body);
                res.status(200).json({ success: true, message: 'contact updated !' })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'POST':
            try {
                let leadToFind = await leadsModel.findOne({ firstname: req.body.firstname, lastname: req.body.lastname });
                if (leadToFind) {
                    res.status(200).json({ success: false, message: 'contact already present on database sorry...' })
                } else {
                    let newLead = new leadsModel(req.body);
                    let leadSaved = await newLead.save();
                    leadSaved
                        ? res.status(200).json({ success: true, message: 'contact successfully saved !', contact: leadSaved })
                        : res.status(400).json({ success: false, message: 'Error while saving... Please try again' })
                }
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'DELETE':
            try {
                let deleteCount = 0;
                for (let userId of req.body) {
                    let userToDelete = await leadsModel.deleteOne({ _id: userId });
                    if (userToDelete.deletedCount === 1) {
                        deleteCount++
                    }
                };
                deleteCount === req.body.length
                    ? res.status(200).json({ success: true, message: 'contact(s) successfully deleted !' })
                    : res.status(400).json({ success: false, message: 'Error while deleting... Please try again' })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
}