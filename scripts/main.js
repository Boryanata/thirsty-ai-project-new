newdiv = document.createElement('div');
document.querySelector('body').appendChild(newdiv);
console.log('HI IM WORKING');

const obj = { name: 'omar' };

document.addEventListener('DOMContentLoaded', () => {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    
    // Handle brain image click
    const brainLink = document.querySelector('.brain-link');
    if (brainLink) {
        brainLink.addEventListener('click', (e) => {
            e.preventDefault();
            const waterDemandSection = document.querySelector('#water-demand');
            if (waterDemandSection) {
                waterDemandSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Get scroll container once for all logic
    const scrollContainer = document.querySelector('.scroll-container');

    // Fade out annotation as soon as we start scrolling (for custom scroll container)
    const annotation = document.querySelector('.landing-section .annotation');
    function handleAnnotationFade() {
        if (!annotation || !scrollContainer) return;
        if (scrollContainer.scrollTop > 0) {
            annotation.style.opacity = '0';
            annotation.style.pointerEvents = 'none';
            annotation.style.transition = 'opacity 0.3s';
        } else {
            annotation.style.opacity = '1';
            annotation.style.pointerEvents = 'auto';
            annotation.style.transition = 'opacity 0.3s';
        }
    }
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleAnnotationFade);
        handleAnnotationFade();
    }

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        // Get the current scroll position
        const scrollPosition = window.scrollY;
        
        // Check if we're near the bottom of the page
        if (window.innerHeight + scrollPosition >= document.documentElement.scrollHeight - 100) {
            // You can add more sections dynamically here if needed
            console.log('Reached bottom of page');
        }
    });

    // Smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated Counter for Olympic Pools (Intersection Observer version)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const poolSection = document.querySelector('.water-demand');
    const poolCounter = document.getElementById('pool-counter');
    const poolCounterMax = document.getElementById('pool-counter-max');
    let counterAnimated = false;
    if (poolSection && poolCounter && poolCounterMax && scrollContainer) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!counterAnimated) {
                            animateCounter(poolCounter, 0, 1700000, 1800);
                            animateCounter(poolCounterMax, 0, 2600000, 2000);
                            counterAnimated = true;
                        }
                    } else {
                        poolCounter.textContent = '0';
                        poolCounterMax.textContent = '0';
                        counterAnimated = false;
                    }
                });
            },
            {
                root: scrollContainer,
                threshold: 0.2 // 20% of the section is visible
            }
        );
        observer.observe(poolSection);
    }

    // Water consumption calculator
    const userInput = document.getElementById('userInput');
    const waterLevel = document.getElementById('waterLevel');
    const waterAmount = document.getElementById('waterAmount');
    const charCount = document.getElementById('charCount');

    // Constants for calculation
    const CHARS_PER_RESPONSE = 100; // Average characters per response
    const ML_PER_RESPONSE = 500; // ml of water per response
    const MAX_WATER_ML = 500; // Maximum water to show in visualization

    function updateWaterConsumption() {
        const text = userInput.value;
        const chars = text.length;
        const responses = chars / CHARS_PER_RESPONSE;
        const waterUsed = Math.round(responses * ML_PER_RESPONSE);
        
        // Update stats
        charCount.textContent = chars;
        waterAmount.textContent = waterUsed;
        
        // Update visualization
        const fillPercentage = Math.min((waterUsed / MAX_WATER_ML) * 100, 100);
        waterLevel.style.height = `${fillPercentage}%`;
    }

    userInput.addEventListener('input', updateWaterConsumption);
});
