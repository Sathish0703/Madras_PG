// Function to initialize all tooltips
function initTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
}

// Function to handle OTP input
function handleOTPInput() {
    const inputs = document.querySelectorAll('.otp-input input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    $('.toggle-password').click(function() {
        $(this).toggleClass('fa-eye fa-eye-slash');
        const input = $($(this).attr('toggle'));
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
        } else {
            input.attr('type', 'password');
        }
    });
}

// Function to initialize image carousel
function initImageCarousel() {
    $('.pg-images').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000
    });
}

// Document ready function
$(document).ready(function() {
    initTooltips();
    handleOTPInput();
    togglePasswordVisibility();
    
    // Initialize carousel if exists on page
    if ($('.pg-images').length) {
        initImageCarousel();
    }
    
    // Handle login/register tab switching
    $('.nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    // Simulate map loading (to be replaced with actual Google Maps API later)
    if (document.getElementById('pg-map')) {
        setTimeout(() => {
            document.getElementById('pg-map').innerHTML = 
                '<div style="padding: 20px; text-align: center; color: #666;">' +
                '<i class="fas fa-map-marker-alt fa-3x mb-3"></i><br>' +
                'Map will be displayed here with PG location</div>';
        }, 1000);
    }
    
    // Handle filter toggle in listings page
    $('#filterToggle').click(function() {
        $('#filtersCollapse').collapse('toggle');
    });
    
    // Handle form submissions (prevent default for demo)
    $('form').submit(function(e) {
        e.preventDefault();
        alert('Form submission would be handled in backend implementation');
        return false;
        
    });
});