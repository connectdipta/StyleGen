import connectDatabase from '../src/config/database.js';
import app from '../src/app.js';

let isConnected = false;

export default async function (req, res) {
    console.log(`[Vercel] Received request: ${req.method} ${req.url}`);
    
    if (!isConnected) {
        console.log('[Vercel] Initializing database connection...');
        try {
            await connectDatabase();
            isConnected = true;
            console.log('[Vercel] Database connected successfully.');
        } catch (error) {
            console.error('[Vercel] Database connection failed:', error);
            res.statusCode = 500;
            return res.json({ 
                error: "Database connection failed", 
                details: error.message,
                diagnostics: {
                    uri_length: process.env.MONGODB_URI?.length,
                    uri_prefix: process.env.MONGODB_URI?.substring(0, 15)
                }
            });
        }
    }
    
    try {
        return app(req, res);
    } catch (error) {
        console.error('[Vercel] App execution error:', error);
        res.statusCode = 500;
        return res.json({ error: "App execution error", details: error.message });
    }
}
