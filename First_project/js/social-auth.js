// Google OAuth
function initGoogleAuth() {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onload = function() {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleAuth,
            ux_mode: 'redirect',
            login_uri: 'http://localhost:3000/auth/google/callback' // Update for production
        });

        // Attach to both login and register buttons
        document.querySelectorAll('[id^="googleSign"]').forEach(btn => {
            btn.addEventListener('click', () => {
                google.accounts.id.prompt();
            });
        });
    }
}

// Facebook OAuth
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
                        handleFacebookAuth(response.authResponse.accessToken);
                    }
                }, {scope: 'public_profile,email'});
            });
        });
    };

    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Handle Google response
function handleGoogleAuth(response) {
    fetch('/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/';
        }
    });
}

// Handle Facebook response
function handleFacebookAuth(token) {
    fetch('/auth/facebook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/';
        }
    });
}

// Initialize both
document.addEventListener('DOMContentLoaded', function() {
    initGoogleAuth();
    initFacebookAuth();
});