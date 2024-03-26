// Description: This file contains the code to fetch notes from server, save notes to server, and delete notes from server. 
document.addEventListener('DOMContentLoaded', function() {
    const saveNoteButton = document.querySelector('.save-note');
    const newNoteButton = document.querySelector('.new-note');
    const clearFormButton = document.querySelector('.clear-btn');
    const noteTitleInput = document.querySelector('.note-title');
    const noteTextInput = document.querySelector('.note-textarea');
//Fetch notes from server and check if notes are fetched successfully or not
    function fetchNotes() {
      //Fetch notes from server and check if notes are fetched successfully or not 
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => {
                const listGroup = document.getElementById('list-group');
                listGroup.innerHTML = ''; 
//Create list group item for each note 
                notes.forEach(note => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
// Create span element for note content 
                    const noteContent = document.createElement('span');
                    noteContent.textContent = `${note.title}: ${note.text}`;
                    li.appendChild(noteContent);

//Create delete button for each note 
                    const deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
                    deleteBtn.innerHTML = '<span class="fas fa-trash"></span>';
                    deleteBtn.addEventListener('click', function() {
                        li.remove();
//Delete note from server 
                    });
                    li.appendChild(deleteBtn);
//Append note to list group 
                    listGroup.appendChild(li);
                });
            })
            //Catch error if notes are not fetched from server 
            .catch(error => console.error('Error fetching notes:', error));
    }
//Fetch notes from server 
    fetchNotes();
  //Update button visibility when note title or text is inputted 
    function updateButtonVisibility() {
        const isNotePresent = noteTitleInput.value.trim() !== '' || noteTextInput.value.trim() !== '';
        saveNoteButton.style.display = isNotePresent ? 'inline-block' : 'none';
        clearFormButton.style.display = isNotePresent ? 'inline-block' : 'none';
        newNoteButton.style.display = isNotePresent ? 'none' : 'inline-block';
    }
  //Update button visibility when note title or text is inputted 
    noteTitleInput.addEventListener('input', updateButtonVisibility);
    noteTextInput.addEventListener('input', updateButtonVisibility);
  //Clear form fields when clear button is clicked 
    clearFormButton.addEventListener('click', function() {
        noteTitleInput.value = '';
        noteTextInput.value = '';
        updateButtonVisibility();
    });
  //Save note to server and check if note is saved successfully or not 
    saveNoteButton.addEventListener('click', function() {
        const noteData = {
            title: noteTitleInput.value.trim(),
            text: noteTextInput.value.trim(),
        };
  //Check if note title and text are filled out 
        if (!noteData.title || !noteData.text) {
            alert('Please fill out both the title and the note text fields.');
            return;
        }
  //Save note to server and check if note is saved successfully or not 
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        })
        //Check if note is saved successfully or not 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        //If note is saved, reload page and clear form fields
        .then(data => {
            console.log('Note saved:', data);
             window.location.reload();
             //Clear form fields 
            noteTitleInput.value = '';
            noteTextInput.value = '';
            updateButtonVisibility();
//Alert user that note is saved successfully 
            alert('Note successfully saved!');
        })
        //Catch error if note is not saved
        .catch((error) => {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        });
    });
});