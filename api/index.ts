import app from '../index';
import { connectDB } from '../config/db';


export default async function handler(req: any, res: any) {
    await connectDB(); 
    return app(req, res);
}