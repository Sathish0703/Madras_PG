const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth
router.post('/auth/google', async (req, res) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // Find or create user
        const user = await findOrCreateUser({
            provider: 'google',
            providerId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        });

        // Create session
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        
        res.json({ 
            success: true,
            redirect: user.role === 'owner' ? '/owner/dashboard' : '/'
        });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// Facebook Auth
router.post('/auth/facebook', async (req, res) => {
    try {
        const { data } = await axios.get(
            `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${req.body.token}`
        );

        // Find or create user
        const user = await findOrCreateUser({
            provider: 'facebook',
            providerId: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture?.data?.url
        });

        // Create session
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        
        res.json({ 
            success: true,
            redirect: user.role === 'owner' ? '/owner/dashboard' : '/'
        });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

async function findOrCreateUser(userData) {
    // Implement your user lookup/creation logic here
    // Example:
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
        user = new User({
            name: userData.name,
            email: userData.email,
            avatar: userData.picture,
            authProvider: userData.provider,
            providerId: userData.providerId,
            role: 'seeker' // Default role
        });
        await user.save();
    }
    
    return user;
}

module.exports = router;