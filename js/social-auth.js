// Updated Google OAuth Initialization
function initGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleAuth
        });
        
        // Render buttons
        document.querySelectorAll('[id^="googleSign"]').forEach(btn => {
            google.accounts.id.renderButton(btn, {
                type: btn.id.includes('Up') ? 'standard' : 'icon',
                size: 'large',
                theme: 'filled_blue',
                text: btn.id.includes('Up') ? 'signup_with' : 'signin_with'
            });
        });
    };
    document.head.appendChild(script);
}

// Updated Facebook OAuth Initialization
function initFacebookAuth() {
    window.fbAsyncInit = function() {
        FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID',
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });

        document.querySelectorAll('[id^="facebookSign"]').forEach(btn => {
            btn.addEventListener('click', () => {
                FB.login(function(response) {
                    if (response.authResponse) {
                        FB.api('/me', {fields: 'name,email,picture'}, (profile) => {
                            handleFacebookAuth({
                                token: response.authResponse.accessToken,
                                profile: profile
                            });
                        });
                    }
                }, {scope: 'public_profile,email'});
            });
        });
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Handle responses
function handleGoogleAuth(response) {
    fetch('/auth/google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({credential: response.credential})
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/';
        } else {
            alert('Login failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => console.error('Error:', err));
}

function handleFacebookAuth(data) {
    fetch('/auth/facebook', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            token: data.token,
            profile: data.profile
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/';
        } else {
            alert('Login failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => console.error('Error:', err));
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initGoogleAuth();
    initFacebookAuth();
});