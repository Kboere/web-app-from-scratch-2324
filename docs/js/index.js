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
    xValue = Math.max(-maxXValue, Math.min(maxXValue, xValue));
    yValue = Math.max(-maxYValue, Math.min(maxYValue, yValue));

    console.log(xValue, yValue);

    // Loop over alle parallax elementen en pas de transform aan
    parallaxElements.forEach((el) => {
        let speedX = el.dataset.speedx;
        let speedY = el.dataset.speedy;

        el.style.transform = `translateX(calc(-50% + ${-xValue * speedX}px)) translateY(calc(-50% + ${yValue * speedY}px))`;
    });
}

// -----------------------------------------------------------------------
// Functie om de timeline artikelen te tonen wanneer ze in beeld komen
// -----------------------------------------------------------------------

// Maak een nieuwe Intersection Observer aan voor de timeline artikelen en voer dan de functie uit
const observeElements = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // vind het doelelement
        const targetElement = entry.target;

        // bekijk of het element in beeld is
        if (entry.isIntersecting) {
            targetElement.classList.add('visible');
        }
    });
}, {
    rootMargin: '-250px 0px' // pas de rootMargin aan om de artikelen eerder of later te laten zien
});

// Start observing each target element
elements.forEach(element => {
    observeElements.observe(element);
});

// -----------------------------------------------------------------------
// Functie om de secties langzaam te laten verschijnen wanneer ze in beeld komen
// -----------------------------------------------------------------------

const fadeIn = document.querySelectorAll('.hidden');

const options = {
  threshold: 0.2
};

fadeIn.forEach(fade => {
  const observerFade = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observerFade.observe(fade);
});



// -----------------------------------------------------------------------
// Functie om random duck images op te halen en te tonen
// -----------------------------------------------------------------------

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
async function updateDuckImages() {
    try {
        const imagesData = await fetchDuckImages();
        imagesData.forEach((imageData, index) => {
            duckImages[index].src = imageData.urls.regular;
            duckImages[index].alt = imageData.alt_description || 'Duck Image';
        });
    } catch (error) {
        console.error('Error updating duck images:', error);
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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Voorbeeld van hoe je de JSON kunt gebruiken om een lijst te maken
async function init() {
    try {
        const data = await loadJSON();
        const outputList = document.getElementById('duckData'); // Get the output list element
        const duck = data.eend; // Access the "eend" object

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
        for (const key in duck) {
            if (duck.hasOwnProperty(key)) {
                const customPropertyName = propertyMapping[key] || key; // Use custom name if exists, otherwise use original property name
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="property">${customPropertyName}:</span> ${duck[key]}`; // Add custom property name and value to the list item
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
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Roep de init functie aan zodra de pagina geladen is
window.onload = init;

