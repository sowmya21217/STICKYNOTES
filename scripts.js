let notes = [];

function addNote() {
    const noteContent = document.getElementById("note-content").value;
    if (noteContent.trim() !== "") {
        const note = {
            content: noteContent,
            left: "50px",
            top: "50px",
            color: "yellow",
        };
        notes.push(note);
        document.getElementById("note-content").value = "";
        renderNotes();
        saveNotes();
    }
}

// Create a new sticky note
function createStickyNote() {
    // ...
    
    // Fetch data from the backend, including text for every 5th note
    fetch('save_notes.php')
        .then(response => response.json())
        .then(data => {
            const notes = data;
            // Create a new note element
            const noteElement = createNoteElement(notes.length, notes[notes.length - 1].content);
            // Append the note element to the notes container
            notesContainer.appendChild(noteElement);
        })
        .catch(error => {
            console.error('Error fetching data from the backend: ' + error);
        });
}


function renderNotes() {
    const notesContainer = document.getElementById("notes-container");
    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        noteElement.style.left = note.left;
        noteElement.style.top = note.top;
        noteElement.style.backgroundColor = note.color;
        noteElement.innerHTML = `
            <textarea oninput="updateNoteContent(${index}, this.value)">${note.content}</textarea>
            <button onclick="deleteNote(${index})">Delete</button>
            <input type="color" value="${note.color}" oninput="changeNoteColor(${index}, this.value)">
        `;

        // Make the note draggable
        noteElement.draggable = true;
        noteElement.addEventListener("dragstart", (e) => onDragStart(e, index));
        noteElement.addEventListener("dragend", (e) => onDragEnd(e, index));
        notesContainer.appendChild(noteElement);
    });
}

function onDragStart(event, index) {
    event.dataTransfer.setData("text/plain", index);
}
function updateNotePosition(index, left, top) {
    notes[index].left = left;
    notes[index].top = top;
    saveNotes();
}

function onDragStart(event, index) {
    isDragging = true;
    currentNote = {
        index,
        offsetX: event.clientX - parseInt(notes[index].left),
        offsetY: event.clientY - parseInt(notes[index].top),
    };
}

document.addEventListener("mousemove", (e) => {
    if (isDragging && currentNote !== null) {
        const noteElement = document.querySelector(`.note:nth-child(${parseInt(currentNote.index) + 1})`);
        if (noteElement) {
            const newLeft = e.clientX - currentNote.offsetX + "px";
            const newTop = e.clientY - currentNote.offsetY + "px";
            noteElement.style.left = newLeft;
            noteElement.style.top = newTop;
            updateNotePosition(currentNote.index, newLeft, newTop);
        }
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    currentNote = null;
});


function onDragEnd(event, index) {
    const noteElement = document.querySelector(`.note:nth-child(${parseInt(index) + 1})`);
    if (noteElement) {
        notes[index].left = noteElement.style.left;
        notes[index].top = noteElement.style.top;
        saveNotes();
    }
}

function updateNoteContent(index, newContent) {
    notes[index].content = newContent;
    saveNotes();
}

function changeNoteColor(index, newColor) {
    notes[index].color = newColor;
    saveNotes();
    renderNotes(); 
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function saveNotes() {
    // Send notes to the server for persistent storage (not implemented here).
     // Serialize the notes array to JSON and send it to the server
     const xhr = new XMLHttpRequest();
     xhr.open("POST", "save_notes.php", true);
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.send("notes=" + JSON.stringify(notes));
}
function loadNotes() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "save_notes.php", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response) {
                notes = response;
                renderNotes();
            }
        }
    };

    xhr.send();
}
window.addEventListener("load", () => {
    loadNotes();
    renderNotes();
});

// Load notes from the server on page load (not implemented here).
