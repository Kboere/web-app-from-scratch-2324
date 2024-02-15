// Parallex elementen variabelen
const parallaxElements = document.querySelectorAll(".para-class");
const section = document.querySelector('#parallex');
let xValue = 0;
let yValue = 0;

// Timeline elementen variabelen
const elements = document.querySelectorAll('.timeline article');

// Flipbox elementen variabelen
const duckImages = document.querySelectorAll('.flip-box-front img');


// -----------------------------------------------------------------------
// Functie om de parallax effecten te verschuiven op mousemove met Intersection Observer
// -----------------------------------------------------------------------

// maak een nieuwe Intersection Observer aan voor de parallax sectie voor mousemove en touchmove en doe dan de functie uitvoeren
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

// Functie om de parallax effecten te verschuiven op mousemove of touchmove
function handleMove(e) {
    let xValue, yValue;
    if (e.type === "mousemove") {
        xValue = e.clientX - window.innerWidth / 2;
        yValue = e.clientY - window.innerHeight / 2;
    } else if (e.type === "touchmove") { 
        xValue = e.touches[0].clientX - window.innerWidth / 2;
        yValue = e.touches[0].clientY - window.innerHeight / 2;
    }

    // limiteer de beweging van de muis voor de x en y as
    const maxXValue = 200;
    const maxYValue = 200;
    // zet de x en y waarde in de range van -200 tot 200
    xValue = Math.max(-maxXValue, Math.min(maxXValue, xValue));
    yValue = Math.max(-maxYValue, Math.min(maxYValue, yValue));

    // Loop over alle parallax elementen en pas de transform aan
    parallaxElements.forEach((el) => {
        let speedX = el.dataset.speedx;
        let speedY = el.dataset.speedy;

        // pas de transform aan met de x en y waarde en de snelheid
        el.style.transform = `translateX(calc(-50% + ${-xValue * speedX}px)) translateY(calc(-50% + ${yValue * speedY}px))`;
    });
}

// -----------------------------------------------------------------------
// Functie om random duck images op te halen en te tonen
// -----------------------------------------------------------------------

// Function to show loading state
function showLoadingState() {
    // Show skeleton loading images
    const loadingStateImages = document.querySelectorAll('.loading-state');
    loadingStateImages.forEach(image => {
        image.style.display = 'block'; // Hide loading state image
    });
}

// Function to hide loading state
function hideLoadingState() {
    // Hide skeleton loading images
    const loadingStateImages = document.querySelectorAll('.loading-state');
    loadingStateImages.forEach(image => {
        image.style.display = 'none'; // Hide loading state image
    });
}

// Function to fetch random duck images
async function fetchDuckImages() {
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?query=duck&count=3&client_id=LNN0KHkEmgDzKRf5PSmkW5m6x514rAg6h-jTP-lfV9U');
        const data = await response.json(); 
        return data;
    } catch (error) {
        console.error('Error fetching duck images:', error);
    }
}

// Function to update duck images
// store random duck images in a variable
async function updateDuckImages() {
    try {
        // Show loading state
        showLoadingState();

        const imagesData = await fetchDuckImages();
        // Get all duck images
        const duckImages = document.querySelectorAll('.duck-image');

        // Loop over all duck images and set the src and alt attributes
        imagesData.forEach((imageData, index) => {
            duckImages[index].src = imageData.urls.regular;
            duckImages[index].alt = imageData.alt_description || 'Duck Image';
            duckImages[index].style.display = 'inline'; // Display duck image
        });

        // Hide loading state after images are loaded
        hideLoadingState();
    } catch (error) {
        console.error('Error updating duck images:', error);
        // Show loading state in case of error
        showLoadingState();

        // Hide duck images in case of error
        const duckImages = document.querySelectorAll('.duck-image');
        duckImages.forEach(image => {
            image.style.display = 'none';
        });
    }
}

// Initial load of duck images
updateDuckImages();


// -----------------------------------------------------------------------
// Functie om "eigenschappen.json" op te halen en de gegevens in een lijst weer te geven
// -----------------------------------------------------------------------

// Functie om JSON in te laden met fetch
async function loadJSON() {
    try {
        const response = await fetch('https://kboere.github.io/web-app-from-scratch-2324/data/eigenschappen.json');
        if (!response.ok) { // If the response is not ok
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Voorbeeld van hoe je de JSON kunt gebruiken om een lijst te maken
async function showDataList() {
    try {
        const data = await loadJSON();
        const outputList = document.getElementById('duckData'); // Get the output list element
        const duck = data.eend; // Access the "eend" object

        const duckData = document.getElementById('duckData');
        const clickableDuck = document.querySelector(".duck");
        const menuContainer = document.createElement('ul');

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

        menuContainer.classList.add('menu-container');

        // Loop through all properties of the "eend" object
        for (const key in duck) {
            // Check if the property is a direct property of the object
            if (duck.hasOwnProperty(key)) {
                const customPropertyName = propertyMapping[key] || key; // Use custom name if exists, otherwise use original property name
                let propertyValue = duck[key];

                // If the property is "favorieteDoelwit", handle it separately
                if (key === 'favorieteDoelwit') {
                    propertyValue = ''; // Reset propertyValue to an empty string
                    const favoriteTargets = duck[key]; // Get the object containing favorite targets

                    // Convert the object to an array of key-value pairs and sort it by the value
                    const sortedTargets = Object.entries(favoriteTargets).sort((a, b) => a[1].localeCompare(b[1]));

                    // Slice the array to get the top 3 targets
                    const top3Targets = sortedTargets.slice(0, 3);

                    // Loop through each favorite target
                    top3Targets.forEach((target, index) => {
                        propertyValue += `${index + 1}. ${target[1]}<br>`; // Concatenate each target with its rank
                    });
                }

                const listItem = document.createElement('li');
                // Add custom property name and value to the list item
                listItem.innerHTML = `<span class="property">${customPropertyName}:</span> ${propertyValue}`;
                menuContainer.appendChild(listItem);
            }
        }

        // Hide the menu initially
        menuContainer.style.display = 'none';

        // Append the menu container to the output list
        outputList.appendChild(menuContainer);

        // Add click event listener to "duckData" element to toggle menu visibility
        duckData.addEventListener('click', function () {
            menuContainer.classList.toggle('active');
            menuContainer.style.display = (menuContainer.style.display === 'none') ? 'block' : 'none';
        });

        clickableDuck.addEventListener('click', function () {
            menuContainer.classList.toggle('active');
            menuContainer.style.display = (menuContainer.style.display === 'none') ? 'block' : 'none';
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Roep de init functie aan zodra de pagina geladen is
showDataList();

