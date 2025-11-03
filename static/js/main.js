/**
 * Main JavaScript for JCORP website
 * Handles active navigation state and video management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        const linkPath = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath === '/') ||
            (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
            link.classList.add('active');
        }
    });
    
    // Ensure only one nav link is active at a time
    const activeLinks = document.querySelectorAll('.nav-link.active');
    if (activeLinks.length > 1) {
        activeLinks.forEach(function(link, index) {
            if (index > 0) {
                link.classList.remove('active');
            }
        });
    }
    
    // Video autoplay handling
    const homeVideo = document.getElementById('home-video');
    if (homeVideo) {
        // Attempt to play video
        const playPromise = homeVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log('Video autoplay prevented:', error);
                // Video will play when user interacts with page
            });
        }
        
        // Ensure video loops
        homeVideo.addEventListener('ended', function() {
            homeVideo.currentTime = 0;
            homeVideo.play();
        });
    }
});

