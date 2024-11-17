let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("getLocation").addEventListener("click", function () {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon], 18);
        marker.setLatLng([lat, lon]);
        marker.bindPopup(`<strong>Your Location:</strong><br>Lat: ${lat}, Lon: ${lon}`).openPopup();
    }, error => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser settings and permissions.");
    });
});

document.getElementById("saveButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error creating static map:", err);
            return;
        }

        // Display static map as an image
        const staticImage = document.getElementById("staticImage");
        staticImage.style.display = 'block'; // Show the image container
        staticImage.src = canvas.toDataURL();

        // Draw static map on hidden canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        // Create puzzle pieces
        createPuzzlePieces(rasterContext);
    });
});

function createPuzzlePieces(context) {
    const randomPuzzle = document.getElementById('randomPuzzle');
    const puzzleBoard = document.getElementById('puzzleBoard');
    randomPuzzle.innerHTML = '';
    puzzleBoard.innerHTML = '';

    const pieces = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = 80;
            pieceCanvas.height = 80;
            pieceCanvas.classList.add('puzzle-piece');
            pieceCanvas.draggable = true;
            const pieceContext = pieceCanvas.getContext('2d');
            pieceContext.drawImage(context.canvas, col * 80, row * 80, 80, 80, 0, 0, 80, 80);

            pieceCanvas.dataset.correctPosition = `${row}-${col}`;
            pieces.push(pieceCanvas);

            const slot = document.createElement('div');
            slot.classList.add('puzzle-slot');
            slot.dataset.correctPosition = `${row}-${col}`;
            puzzleBoard.appendChild(slot);
        }
    }

    shuffle(pieces);
    pieces.forEach(piece => randomPuzzle.appendChild(piece));

    enableDragAndDrop();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function enableDragAndDrop() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const slots = document.querySelectorAll('.puzzle-slot');

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text", event.target.dataset.correctPosition);
        });
    });

    slots.forEach(slot => {
        slot.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        slot.addEventListener("drop", function (event) {
            const correctPosition = event.dataTransfer.getData("text");
            const piece = document.querySelector(`[data-correct-position="${correctPosition}"]`);
            if (slot.dataset.correctPosition === correctPosition && !slot.firstChild) {
                slot.appendChild(piece);
                slot.classList.add('valid');
                if (isPuzzleComplete()) {
                    alert("Puzzle completed!");
                }
            }
        });
    });
}

// Function: Check if puzzle is complete
function isPuzzleComplete() {
    const slots = document.querySelectorAll('.puzzle-slot');
    const allCorrect = Array.from(slots).every(slot =>
        slot.firstChild && slot.dataset.correctPosition === slot.firstChild.dataset.correctPosition
    );

    console.log(`Puzzle complete: ${allCorrect}`); // Informacja w konsoli

    return allCorrect;
}
