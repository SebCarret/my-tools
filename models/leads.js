import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    company: String,
    domain: String,
    email: String,
    status: String,
    list: String,
    linkedinUrl: String
});

export default mongoose.models.Leads || mongoose.model('Leads', LeadSchema);