
// -----------------------------------------------------------------------
// Functie om de parallex effecten te verschuiven op mousemove met Intersection Observer
// -----------------------------------------------------------------------

const parallex_elements = document.querySelectorAll(".para-class");

let xValue = 0;
let yValue = 0;

const section = document.querySelector('#parallex');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.80) {
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("touchmove", handleMove);
        } else {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
        }
    });
}, { threshold: 0.80 });

observer.observe(section);

function handleMove(e) {
    let xValue, yValue;
    if (e.type === "mousemove") {
        xValue = e.clientX - window.innerWidth / 2;
        yValue = e.clientY - window.innerHeight / 2;
    } else if (e.type === "touchmove") {
        xValue = e.touches[0].clientX - window.innerWidth / 2;
        yValue = e.touches[0].clientY - window.innerHeight / 2;
    }

    // Limit movement to a maximum of 50 pixels in each direction
    const maxXValue = 200;
    const maxYValue = 200;
    xValue = Math.max(-maxXValue, Math.min(maxXValue, xValue));
    yValue = Math.max(-maxYValue, Math.min(maxYValue, yValue));

    console.log(xValue, yValue);

    parallex_elements.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;

        el.style.transform = `translateX(calc(-50% + ${-xValue * speedx}px)) translateY(calc(-50% + ${yValue * speedy}px))`;
    });
}

// -----------------------------------------------------------------------
// Functie om de timeline artikelen te tonen wanneer ze in beeld komen
// -----------------------------------------------------------------------

// Select the target elements using querySelectorAll
const elements = document.querySelectorAll('.timeline article');

// Create a new Intersection Observer for each element
const observeElements = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // Find the target element from the entry
        const targetElement = entry.target;

        // Check if the target element is intersecting with the viewport
        if (entry.isIntersecting) {
            // If intersecting, add a CSS class to make it visible
            targetElement.classList.add('visible');
        }
    });
}, {
    rootMargin: '-250px 0px' // Adjust the margin to trigger when element is 250px away from the viewport
});

// Start observing each target element
elements.forEach(element => {
    observeElements.observe(element);
});

// -----------------------------------------------------------------------
// Functie om random duck images op te halen en te tonen
// -----------------------------------------------------------------------

// const duckImages = document.querySelectorAll('.flip-box-front img');

//     // Function to fetch random duck images
//     async function fetchDuckImages() {
//         try {
//             const response = await fetch('https://api.unsplash.com/photos/random?query=duck&count=3&client_id=LNN0KHkEmgDzKRf5PSmkW5m6x514rAg6h-jTP-lfV9U');
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('Error fetching duck images:', error);
//         }
//     }

//     // Function to update duck images
//     async function updateDuckImages() {
//         try {
//             const imagesData = await fetchDuckImages();
//             imagesData.forEach((imageData, index) => {
//                 duckImages[index].src = imageData.urls.regular;
//                 duckImages[index].alt = imageData.alt_description || 'Duck Image';
//             });
//         } catch (error) {
//             console.error('Error updating duck images:', error);
//         }
//     }

//     // Initial load of duck images
//     updateDuckImages();


// -----------------------------------------------------------------------
// Function to fetch "eigenschappen.json" and display the data in a list
// -----------------------------------------------------------------------

// Functie om JSON in te laden met fetch
function loadJSON() {
    return fetch('https://kboere.github.io/web-app-from-scratch-2324/data/eigenschappen.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Voorbeeld van hoe je de JSON kunt gebruiken om een lijst te maken
function init() {
    loadJSON()
        .then(data => {
            const outputList = document.getElementById('duckData'); // Get the output list element
            const eend = data.eend; // Access the "eend" object

            // Define a mapping object for custom property names
            const propertyMapping = {
                "naam": "Naam",
                "leeftijd": "Leeftijd in eendenjaren",
                "eendenNaam": "Eenden naam",
                "karakter": "Karakter van eend",
                "woonVijver": "Mijn woonvijver",
                "favorieteBrood": "Favoriete brood",
                "kwikKwekKwak": "Ik ben een kwik, kwek of kwakker",
                "favorieteDoelwit": "Mijn favoriete poepdoelwit",
            };

            // Create a menu container
            const menuContainer = document.createElement('ul');
            menuContainer.classList.add('menu-container');

            // Loop through all properties of the "eend" object
            for (const key in eend) {
                if (eend.hasOwnProperty(key)) {
                    const customPropertyName = propertyMapping[key] || key; // Use custom name if exists, otherwise use original property name
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<span class="property">${customPropertyName}:</span> ${eend[key]}`; // Add custom property name and value to the list item
                    menuContainer.appendChild(listItem);
                }
            }

            // Hide the menu initially
            menuContainer.style.display = 'none';

            // Append the menu container to the output list
            outputList.appendChild(menuContainer);

            // Add click event listener to "duckData" element to toggle menu visibility
            const duckData = document.getElementById('duckData');
            duckData.addEventListener('click', function () {
                menuContainer.classList.toggle('active');
                menuContainer.style.display = (menuContainer.style.display === 'none') ? 'block' : 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Roep de init functie aan zodra de pagina geladen is
window.onload = init;
