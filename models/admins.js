import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    template: String
})

const adminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    hunterKey: String,
    dropcontactKey: String,
    emailjsId: String,
    templates: Array
});

export default mongoose.models.Admins || mongoose.model('Admins', adminSchema);