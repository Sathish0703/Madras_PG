const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(
  '508018979482-5nnr97r8a473s8v4g8dl7lnqmioqh76d.apps.googleusercontent.com',  // 🔴 Client ID
  'RGOCSPX-XrVV0xpC3nmhEIq9n33MMyMlz3YW',                         // 🔴 Client Secret
  'http://localhost:5500/auth/google/callback'              // 🔴 Redirect URI
);

// Enhanced Google Auth
router.post('/auth/google', async (req, res) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const user = await findOrCreateUser({
            provider: 'google',
            providerId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            success: true,
            token,
            redirect: user.role === 'owner' ? '/owner/dashboard' : '/'
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Authentication failed' 
        });
    }
});

// Enhanced Facebook Auth
router.post('/auth/facebook', async (req, res) => {
    try {
        // Verify access token
        const { data } = await axios.get(
            `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${req.body.token}`
        );

        const user = await findOrCreateUser({
            provider: 'facebook',
            providerId: data.id,
            email: data.email || `${data.id}@facebook.com`,
            name: data.name,
            picture: data.picture?.data?.url
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            success: true,
            token,
            redirect: user.role === 'owner' ? '/owner/dashboard' : '/'
        });
    } catch (error) {
        console.error('Facebook auth error:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Authentication failed' 
        });
    }
});

// Enhanced findOrCreateUser function
async function findOrCreateUser(userData) {
    // Check if user exists by provider ID
    let user = await User.findOne({ 
        $or: [
            { providerId: userData.providerId },
            { email: userData.email }
        ]
    });
    
    if (!user) {
        user = new User({
            name: userData.name,
            email: userData.email,
            avatar: userData.picture,
            authProvider: userData.provider,
            providerId: userData.providerId,
            role: 'user', // Default role
            verified: true // Social logins are verified
        });
        await user.save();
    } else if (!user.providerId) {
        // Update existing user with provider info
        user.authProvider = userData.provider;
        user.providerId = userData.providerId;
        if (!user.avatar) user.avatar = userData.picture;
        await user.save();
    }
    
    return user;
}

module.exports = router;