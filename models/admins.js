import Password from 'antd/lib/input/Password';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    hunterKey: String,
    dropcontactKey: String,
    emailjsId: String
});

export default mongoose.models.Admins || mongoose.model('Admins', adminSchema);