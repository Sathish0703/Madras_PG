 // Load Google API client
function loadGoogleAPI() {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Initialize Google Sign-In
function initGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    callback: handleGoogleResponse
  });
  
  // Render button (or use automatic rendering)
  google.accounts.id.renderButton(
    document.getElementById('googleSignIn'),
    { theme: 'outline', size: 'large' } // customization
  );
  
  // Optional: Display the One Tap dialog
  google.accounts.id.prompt();
}

// Handle Google response
function handleGoogleResponse(response) {
  const responsePayload = decodeJWT(response.credential);
  
  console.log('Google user:', responsePayload);
  // Here you would send this data to your backend for verification
  // and user session creation
}

// Helper to decode JWT
function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadGoogleAPI();
  // Small delay to ensure Google script is loaded
  setTimeout(initGoogleSignIn, 500);
});