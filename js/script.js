document.addEventListener("DOMContentLoaded", () => {
    // --- Parallax Effect ---
    // Selectors (Text removed from parallax as requested)
    const parallaxElements = [
        { selector: '.yash-decoration-lamp', speed: 0.5 },
        { selector: '.flying-lamps-container', speed: 0.8 },
        { selector: '.particles-container', speed: 0.2 },
        // { selector: '.hero-text-wrapper', speed: 0.3 }, // REMOVED text parallax
        { selector: '.yash-boat-image', speed: -0.2, horizontal: 0.1 }, 
        { selector: '.yash-smoky-image', speed: 0.1 },
        
        // Section 2 Parallax (Images only)
        //  { selector: '.yash-welcome-image', speed: 0.1, section: '.yash-wave-container' }, 
         // Controlled separately below
//         { selector: '.welcome-lamp-left-container', speed: 0.4, section: 'flying-lamps-container' },
   //      { selector: '.welcome-lamp-right-container', speed: 0.4, section: 'flying-lamps-container' },
//         { selector: '.yash-welcome-nameletter-container', speed: 0.2, section: '.yash-wave-container' } // Center logo, maybe keep stable?
    ];

    const section2 = document.querySelector('.yash-wave-container');
    const welcomeWave = document.querySelector('.yash-welcome-wave');

    // --- Reveal Elements Initialization ---
    const revealElements = [
        document.querySelector('.welcome-lamp-left-container'),
        document.querySelector('.welcome-lamp-right-container'),
        document.querySelector('.yash-welcome-nameletter-container') 
    ];

    // Hide them initially
    revealElements.forEach(el => {
        if(el) el.classList.add('reveal-hidden');
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // 1. General Parallax
        parallaxElements.forEach(el => {
            const element = document.querySelector(el.selector);
            if (!element) return;

            let yPos = 0;
            let xPos = 0;

            if (el.section === '.yash-wave-container') {
                if (section2) {
                    const sectionTop = section2.offsetTop;
                    const dist = scrollY - sectionTop + windowHeight;
                    if (dist > 0) {
                        yPos = (scrollY - sectionTop) * el.speed;
                    }
                }
            } else {
                yPos = scrollY * el.speed;
                if (el.horizontal) {
                    xPos = scrollY * el.horizontal;
                }
            }
            element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        });

        // 2. Section 2 Special Animation (Zoom & Move Up)
        // "slowly moving the top correct position and zoom in animation"
        if (section2 && welcomeWave) {
            const sectionTop = section2.offsetTop;
            const scrollBuffer = windowHeight * 0.8; // Start slightly before
            
            // Calculate progress as we scroll into the section
            // When scrollY reaches sectionTop, we want it to be fully in position (scale 1, translate 0)
            // We start animating when scrollY is (sectionTop - windowHeight)
            
            // Relative scroll position
            const diff = scrollY - (sectionTop - windowHeight);
            
            if (diff > 0 && scrollY < sectionTop + section2.offsetHeight) {
                // Progress from 0 to 1
                let progress = diff / windowHeight; 
                if (progress > 1) progress = 1;

                // Start: scale 0.8, translateY 100px
                // End: scale 1, translateY 0px
                const scale = 0.8 + (0.2 * progress); // 0.8 -> 1.0
                const translateY = 100 - (100 * progress); // 100 -> 0

                // Apply specifically to the inner image or container? 
                // The user said "yash-welcome-wave container".
                welcomeWave.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                welcomeWave.style.transformOrigin = 'center bottom'; // Zoom from bottom usually looks more grounded for waves
                welcomeWave.style.transition = 'transform 0.1s linear'; // Smooth out jitters, but keep it responsive

                // --- TRIGGER REVEAL ---
                // "after that... show correct sequence"
                // Trigger when progress is high (image nearly/fully in place)
                if (progress > 0.85) {
                    revealElements.forEach((el, index) => {
                         if(el) {
                             if (!el.classList.contains('reveal-visible')) {
                                 setTimeout(() => {
                                     el.classList.add('reveal-visible');
                                     el.classList.remove('reveal-hidden');
                                 }, index * 300); // 300ms stagger
                             }
                         }
                    });
                }
            }
        }

        

    });


    // --- Typing Animation & Reset ---
    const typingTargets = [
        '.hero-title',
        '.yash-welcome-text',
        '.yash-welcome-text-bold',
        '.yash-welcome-name',
        '.yash-invite-blue-text',
        '.yash-name',
        '.nikki-name',
        '.yash-thigs-text-container h2',
        '.yash-thigs-text-container p',
        '.yash-beach-text-container h3',
        '.yash-beach-text-container h2',
        '.yash-beach-text-container p'
    ];

    typingTargets.forEach(selector => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            prepareTypingEffect(el);
        });
    });

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Scroll DOWN or entering: Start Animation
                startTyping(entry.target);
            } else {
                // Scroll UP/Leaving: Reset
                resetTyping(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-type-target').forEach(el => {
        observer.observe(el);
    });

    // --- Event Card Scroll Animation ---
    const eventCards = document.querySelectorAll('.event-card');
    
    // Initial Class Assignment based on Index (0-based)
    // 0: Left, 1: Bottom, 2: Right, 3: Left, 4: Right
    eventCards.forEach((card, index) => {
        if (index === 0 || index === 3) {
            card.classList.add('enter-from-left');
        } else if (index === 1) {
            card.classList.add('enter-from-bottom');
        } else if (index === 2 || index === 4) {
            card.classList.add('enter-from-right');
        }
    });

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;
            if (entry.isIntersecting) {
                // Add active class to bring to center/visible
                card.classList.add('card-in-view');
            } else {
                // Remove active class to reset to initial "off" state
                card.classList.remove('card-in-view');
            }
        });
    }, { threshold: 0.15 }); // Slightly higher threshold to ensure it doesn't flicker on edge

    eventCards.forEach(card => {
        cardObserver.observe(card);
    });

    // --- Common Glow Text Reveal (Event Title & See Route) ---
    const glowTexts = document.querySelectorAll('.common-glow-text');
    if (glowTexts.length > 0) {
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-reveal-visible');
                } else {
                     entry.target.classList.remove('text-reveal-visible'); 
                }
            });
        }, { threshold: 0.5 });
        
        glowTexts.forEach(text => textObserver.observe(text));
    }



    // --- Things Grid Item Animation ---
    const gridItems = document.querySelectorAll('.yash-things-grid__item');
    if (gridItems.length > 0) {
        // Assign initial classes based on index
        gridItems.forEach((item, index) => {
             if (index === 0) item.classList.add('enter-from-left');
             else if (index === 1) item.classList.add('enter-from-bottom'); // Center item
             else if (index === 2) item.classList.add('enter-from-right');
             else item.classList.add('enter-from-bottom'); // Default fallback
        });

        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   entry.target.classList.add('card-in-view');
                } else {
                   entry.target.classList.remove('card-in-view'); // Reset
                }
            });
        }, { threshold: 0.2 });

        gridItems.forEach(item => gridObserver.observe(item));
    }

    // --- Clock Entry Animation ---
    const clockWrapper = document.querySelector('.clock-wrapper');
    if (clockWrapper) {
        clockWrapper.classList.add('enter-from-bottom');
        
        const clockObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   entry.target.classList.add('card-in-view');
                } else {
                   entry.target.classList.remove('card-in-view');
                }
            });
        }, { threshold: 0.2 });
        clockObserver.observe(clockWrapper);
    } 

    function prepareTypingEffect(element) {
        element.classList.add('animate-type-target');
        wrapCharacters(element);
    }

    function wrapCharacters(element) {
        // Recursive function to wrap all text nodes in <span>
        Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === 3) { // Text node
                // Normalize whitespace: replace newlines/tabs/multiple spaces with single space
                // But preserve single leading/trailing space if it exists in the original (for spacing between elements)
                let text = node.textContent;
                
                // If the entire node is just whitespace, and it's surrounded by block elements, browsers often ignore it.
                // But here we are deep in text. 
                // Simple approach: Replace all whitespace sequences with a single space.
                text = text.replace(/\s+/g, ' ');

                // Avoid empty whitespace nodes if they collapse to empty string, but keep ' '
                if (text.length > 0) { 
                     const frag = document.createDocumentFragment();
                     [...text].forEach(char => {
                         const span = document.createElement('span');
                         span.textContent = char;
                         span.className = 'char-reveal';
                         // Identify spaces for potential CSS targeting if needed
                         if (char === ' ') span.classList.add('char-space');
                         
                         span.style.opacity = '0'; // Hidden initially
                         frag.appendChild(span);
                     });
                     node.parentNode.replaceChild(frag, node);
                }
            } else if (node.nodeType === 1) { // Element node
                wrapCharacters(node);
            }
        });
    }

    function startTyping(element) {
        const chars = element.querySelectorAll('.char-reveal');
        chars.forEach((char, index) => {
            // Stagger delay
            setTimeout(() => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, index * 30); // Faster typing speed
        });
    }

    function resetTyping(element) {
        const chars = element.querySelectorAll('.char-reveal');
        chars.forEach(char => {
            char.style.opacity = '0';
            // Optional: pop up effect reset
             char.style.transform = 'translateY(10px)'; 
        });
    }
    
    // --- Section 2 Entry Sequence Removed (Reverted due to visibility issues) ---
    // User requested undo locally.
});
