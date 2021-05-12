import DbConnect from '../../models/dbConnect';
import leadsModel from '../../models/leads';

export default async function handler(req, res) {

    const { method } = req;

    await DbConnect();

    switch (method) {
        case 'PUT':
            try {
                const lead = await leadsModel.updateOne({ _id: req.body._id }, {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    company: req.body.company,
                    domain: req.body.domain,
                    email: req.body.email,
                    linkedinUrl: req.body.linkedinUrl
                });
                res.status(200).json({ success: true, message: 'contact updated !' })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'POST':
            try {
                let leadToFind = await leadsModel.findOne({ firstname: req.body.firstname, lastname: req.body.lastname });
                if (leadToFind) {
                    res.status(200).json({ success: false, message: 'contact déjà présent en base de données...' })
                } else {
                    let newLead = new leadsModel({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        company: req.body.company,
                        list: req.body.list
                    });
                    let leadSaved = await newLead.save();
                    leadSaved
                        ? res.status(200).json({ success: true, message: 'contact sauvegardé !' })
                        : res.status(400).json({ success: false, message: 'contact non sauvegardé... Veuillez rééssayez.' })
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
                    ? res.status(200).json({ success: true, message: 'contact(s) supprimé(s) !' })
                    : res.status(400).json({ success: false, message: 'Erreur lors de la suppression... Veuillez rééssayez.' })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
}