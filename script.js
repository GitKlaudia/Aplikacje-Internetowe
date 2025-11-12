let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map).bindPopup("Hello!!!!").openPopup();

navigator.geolocation.getCurrentPosition(() => {}, () => {}, {timeout:1});
if (Notification.permission === "default") Notification.requestPermission();

document.getElementById("getLocation").onclick = () => {
    navigator.geolocation.getCurrentPosition(pos => {
        let lat = pos.coords.latitude, lon = pos.coords.longitude;
        map.setView([lat, lon], 18);
        marker.setLatLng([lat, lon]).setPopupContent(`${lat.toFixed(6)}, ${lon.toFixed(6)}`).openPopup();
    });
};

document.getElementById("saveButton").onclick = () => {
    leafletImage(map, (err, canvas) => {
        let rs = document.getElementById("rasterMap");
        rs.width = 600;
        rs.height = 300;
        rs.getContext("2d").drawImage(canvas, 0, 0, 600, 300);
        rs.style.display = "block";
        document.getElementById("startPuzzle").disabled = false;
    });
};
document.getElementById("startPuzzle").onclick = () => {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("Nie przyznano zgody na powiadomienia. Powiadomienie nie zadziała.");
            }
        });
    }

    const sourceCanvas = document.getElementById("rasterMap");
    const puzzleArea = document.getElementById("map2"); 
    const tableContainer = document.getElementById("tableContainer"); 
    puzzleArea.innerHTML = "";
    tableContainer.innerHTML = "";

    const pieceWidth = 150;  
    const pieceHeight = 75;
    let pieces = [];
    let correctCount = 0;

    let slots = [];
    for (let i = 0; i < 16; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.index = i;
        slot.style.width = pieceWidth + "px";
        slot.style.height = pieceHeight + "px";
        slot.style.position = "absolute";
        slot.style.left = `${(i % 4) * pieceWidth}px`;
        slot.style.top = `${Math.floor(i / 4) * pieceHeight}px`;
        slot.style.border = "1px dashed #333";
        puzzleArea.appendChild(slot);
        slots.push(slot);
    }

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = pieceWidth;
            tempCanvas.height = pieceHeight;
            const ctx = tempCanvas.getContext("2d");
            ctx.drawImage(
                sourceCanvas,
                c * pieceWidth, r * pieceHeight,
                pieceWidth, pieceHeight,
                0, 0,
                pieceWidth, pieceHeight
            );

            const img = document.createElement("img");
            img.src = tempCanvas.toDataURL();
            img.width = pieceWidth;
            img.height = pieceHeight;
            img.draggable = true;
            img.dataset.index = r * 4 + c; 
            img.style.margin = "2px";
            img.style.position = "relative";

            img.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text", img.dataset.index);
                e.dataTransfer.setData("sourceId", img.parentElement.id);
            });

            pieces.push(img);
        }
    }

    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach(img => tableContainer.appendChild(img));

    function handleDrop(target, e) {
        e.preventDefault();
        const index = e.dataTransfer.getData("text");
        const draggedImg = pieces.find(p => p.dataset.index === index);
        if (!draggedImg) return;

        draggedImg.parentElement.removeChild(draggedImg);
        target.appendChild(draggedImg);

        draggedImg.style.position = target.id === "tableContainer" ? "relative" : "absolute";
        draggedImg.style.left = target.id === "tableContainer" ? "0px" : "0px";
        draggedImg.style.top = target.id === "tableContainer" ? "0px" : "0px";

        if (target.classList.contains("slot")) {
            if (draggedImg.dataset.index == target.dataset.index) {
                if (!draggedImg.dataset.correct) correctCount++;
                draggedImg.dataset.correct = "true";
            } else {
                if (draggedImg.dataset.correct) correctCount--;
                draggedImg.dataset.correct = "";
            }
        } else {
            if (draggedImg.dataset.correct) {
                draggedImg.dataset.correct = "";
                correctCount--;
            }
        }

        if (correctCount === 16) {
            new Notification("Puzzle ułożone!");
            console.log("Puzzle ułożone!");
        }
    }

    slots.forEach(slot => {
        slot.addEventListener("dragover", e => e.preventDefault());
        slot.addEventListener("drop", e => handleDrop(slot, e));
    });

    tableContainer.addEventListener("dragover", e => e.preventDefault());
    tableContainer.addEventListener("drop", e => handleDrop(tableContainer, e));

    puzzleArea.addEventListener("dragover", e => e.preventDefault());
    puzzleArea.addEventListener("drop", e => {
        if (!e.target.classList.contains("slot")) {
            e.preventDefault();
            const index = e.dataTransfer.getData("text");
            const draggedImg = pieces.find(p => p.dataset.index === index);
            if (!draggedImg) return;

            draggedImg.parentElement.removeChild(draggedImg);
            draggedImg.style.position = "absolute";
            draggedImg.style.left = `${e.offsetX - pieceWidth/2}px`;
            draggedImg.style.top = `${e.offsetY - pieceHeight/2}px`;
            puzzleArea.appendChild(draggedImg);

            if (draggedImg.dataset.correct) {
                draggedImg.dataset.correct = "";
                correctCount--;
            }
        }
    });
};

