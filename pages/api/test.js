import dbConnect from '../../models/dbConnect';

export default async function handler(req, res){
    await dbConnect();
    try {
        res.status(200).json({result: true, message: 'connection à la DB OK'})
    } catch(error){
        res.status(400).json({result: false, error: error})
    }
    
};