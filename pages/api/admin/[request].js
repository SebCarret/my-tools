import DbConnect from '../../../models/dbConnect';
import adminModel from '../../../models/admins';
import bcrypt from 'bcrypt';

export default async function adminRequest(req, res) {

    const { request } = req.query;

    await DbConnect();

    switch (request) {
        case 'create':
            try {
                const admin = await adminModel.findOne({ email: req.body.email });

                if (!admin) {

                    const pwdHashed = bcrypt.hashSync(req.body.password, 10);

                    const newAdmin = new adminModel({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: pwdHashed
                    });

                    const newAdminSaved = await newAdmin.save();

                    res.status(200).json({success: true, admin: newAdminSaved})
                } else {
                    res.status(200).json({ success: false, error: 'This admin already exists sorry...' })
                }
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'login':
            try {
                const admin = await adminModel.findOne({email: req.body.email});
                if (admin){
                    const checkPwd = bcrypt.compareSync(req.body.password, admin.password);
                    checkPwd ? res.status(200).json({ success: true, admin}) : res.status(200).json({ success: false, error: 'This password is false... Please try again' })
                } else {
                    res.status(200).json({ success: false, error: 'This email doesn\'t exist on our database sorry...' })
                }
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'logout':
            try {
                res.status(200).json({ success: true,  message: 'Redirection to login OK'})
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
}