let flashcardsData = []; // Przechowuje dane fiszek wczytane z pliku CSV
let currentFlashcardIndex = null; // Indeks bieżącej fiszki do wyświetlenia
let isPolishToGerman = false; // Tryb fiszek: true - polsko-niemieckie, false - niemiecko-polskie
let isWordType = true;
let isWriteType = false;
let correctTranslationsCount = 0;
let correctIndexes = []
let setName = 0
let lastClickTime = -1;

// Funkcja wczytująca plik CSV
function fetchCsvFile() {
    let fileName ="zestawy/"+setName+ ".csv";

    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            flashcardsData = rows.map(row => row.split(';'));
            if (currentFlashcardIndex > flashcardsData.length || currentFlashcardIndex == null){
                currentFlashcardIndex = getRandomIndex(flashcardsData.length);
            }
            showFlashcard(currentFlashcardIndex); // Pokaż pierwszą fiszkę po wczytaniu danych
            updateCorrectCountDisplay()
        })
        .catch(error => console.error('Błąd wczytywania pliku CSV:', error));
        
}


// Funkcja pokazująca odpowiedź
function showAnswer() {
    //console.log(`Osoba: ${person.name}, Wiek: ${person.age}`);
    
    const back = document.getElementById('back');
    
    const currentFlashcard = flashcardsData[currentFlashcardIndex];
    if (currentFlashcard) {
        back.textContent = isPolishToGerman ? currentFlashcard[0] : currentFlashcard[1];
        back.style.visibility = 'visible';
    }
}

// Funkcja przejścia do losowej fiszki
function nextFlashcard() {
    const back = document.getElementById('back');
    const translationInput = document.getElementById('translationInput');
    if (translationInput) {
        translationInput.classList.remove('correct');
        translationInput.classList.remove('incorrect');
        translationInput.value = '';
    }
    back.textContent = ''; // Wyczyść zawartość tyłu fiszki przed przejściem do losowej fiszki
    currentFlashcardIndex = getRandomIndex(flashcardsData.length);
    showFlashcard(currentFlashcardIndex);
}

// Wywołanie funkcji wczytującej plik CSV po załadowaniu strony
window.onload = function() {
    setName = randomizeOption();
    fetchCsvFile();
};

function getRandomIndex(max) {
    let randomIndex = Math.floor(Math.random() * max);
    if (correctIndexes.length != max){
        while (correctIndexes.includes(randomIndex)){
            randomIndex = Math.floor(Math.random() * max);
        }
    }
    
    return randomIndex;
}

// Funkcja zmieniająca tryb fiszek
function switchFlashcardType() {
    isPolishToGerman = !isPolishToGerman;
    updateSwitchButtonText(); // Zaktualizuj tekst na przycisku
    nextFlashcard(); // Wyświetl nową fiszkę w aktualnym trybie
}

function switchWordSentenceType() {
    isWordType = !isWordType;
    console.log('max wyrazy 29');
    updateSwitchWordSentenceButtonText(); // Zaktualizuj tekst na przycisku
    fetchCsvFile()
    nextFlashcard(); // Wyświetl nową fiszkę w aktualnym trybie
    console.log('index po: '+currentFlashcardIndex);
}

// Funkcja zaktualizowania tekstu na przycisku switchBtn
function updateSwitchButtonText() {
    const switchBtn = document.getElementById('switchBtn');
    if (!isPolishToGerman) {
        switchBtn.textContent = 'Fiszki polsko-niemieckie';
    } else {
        switchBtn.textContent = 'Fiszki niemiecko-polskie';
    }
}

function updateSwitchWordSentenceButtonText() {
    const switchBtn = document.getElementById('wordSentenceBtn');
    if (!isWordType) {
        switchBtn.textContent = 'Wyrazy';
    } else {
        switchBtn.textContent = 'Zdania';
    }
}

// Funkcja wyświetlająca bieżącą fiszkę
function showFlashcard(index) {
    const flashcard = flashcardsData[index];
    if (flashcard) {
        const front = document.getElementById('front');
        const back = document.getElementById('back');
        
        if (isPolishToGerman) {
            front.textContent = flashcard[1]; // Polski
            back.textContent = flashcard[0]; // Niemiecki
        } else {
            front.textContent = flashcard[0]; // Niemiecki
            back.textContent = flashcard[1]; // Polski
        }
        
        // Ukryj tylną stronę fiszki na początku
        back.style.visibility = 'hidden';
    }
}

function switchWriteType() {
    isWriteType = !isWriteType;
    const back = document.getElementById('back');
    const tlumczenieSection = document.getElementById('tlumaczenie');
    if (isWriteType) {
        // back.style.display = 'none';
        tlumczenieSection.innerHTML = `
            <input type="text" id="translationInput" placeholder="Wpisz tłumaczenie" />
            <button id="checkBtn" onclick="checkTranslation()">Sprawdź</button>
        `;
        // tlumczenie.style.display = 'block';
        // tlumczenie.focus();
    }else{
        // back.style.display = 'block';
        tlumczenieSection.innerHTML = ``
        // tlumczenie.style.display = 'none';
        // back.focus();
    }

}

function checkTranslation() {
    const translationInput = document.getElementById('translationInput');
    const userInput = translationInput.value
    let correctTranslation
    const currentFlashcard = flashcardsData[currentFlashcardIndex];
    if (currentFlashcard) {
        correctTranslation = isPolishToGerman ? currentFlashcard[0] : currentFlashcard[1];
    }
    // check if correctTranslation has space on the end
    if (correctTranslation.endsWith(' ')) {
        correctTranslation = correctTranslation.slice(0, -1);
    }
    console.log('poprawne:  '+correctTranslation)
    console.log('odpowiedz: '+userInput)
    console.log('czy rowne: '+userInput === correctTranslation)
    showAnswer()
    if (userInput == correctTranslation) {
        translationInput.classList.remove('incorrect'); // Usuwamy klasę "incorrect", jeśli była wcześniej dodana
        translationInput.classList.add('correct'); // Dodajemy klasę "correct" dla poprawnej odpowiedzi
        // alert('Poprawna odpowiedź!');
        // check if currentFlashcardIndex is in correctIndexes

        if (!correctIndexes.includes(currentFlashcardIndex)) {
            correctIndexes.push(currentFlashcardIndex)
            correctTranslationsCount++;
        }
        
        updateCorrectCountDisplay();
    } else {
        translationInput.classList.remove('correct'); // Usuwamy klasę "correct", jeśli była wcześniej dodana
        translationInput.classList.add('incorrect'); // Dodajemy klasę "incorrect" dla błędnej odpowiedzi
        
        // alert('Błędna odpowiedź. Spróbuj ponownie.');
    }
}

function updateCorrectCountDisplay() {
    // Znajdź element, gdzie będzie wyświetlany wynik
    const correctCountElement = document.getElementById('correctCount');

    // Aktualizuj zawartość elementu z liczbą poprawnych tłumaczeń i liczby wszystkich fiszek
    if (correctCountElement) {
        correctCountElement.textContent = `${correctTranslationsCount}/${flashcardsData.length}`;
    }
}

// function which chose option for select
function selectOption(option) {
    var selectElement = document.getElementById("flashcardSet");
    var options = selectElement.options;
    
    // Losowanie indeksu opcji
    var randomIndex = Math.floor(Math.random() * options.length);
    
    // Ustawianie wybranej opcji
    selectElement.selectedIndex = randomIndex;
};

document.getElementById("flashcardSet").addEventListener("change", function() {
    var selectElement = document.getElementById("flashcardSet");
    // var selectElementList = document.getElementById("flashcardSetList");
    // var options = selectElementList.options;
    setName = selectElement.value;
    console.log('wybrano:  '+setName)
    fetchCsvFile();
    nextFlashcard();

});

function randomizeOption() {
    var selectElement = document.getElementById("flashcardSetList");
    var options = selectElement.options;
    
    // Losowanie indeksu opcji
    var randomIndex = Math.floor(Math.random() * options.length);
    
    // Ustawianie wybranej opcji
    var inputSelectElement = document.getElementById("flashcardSet");
    selectElement.selectedIndex = randomIndex;
    inputSelectElement.value = options[randomIndex].value
    return options[randomIndex].value;
}

function openIrregularVerbs() {
    // Nazwa pliku HTML, który ma zostać otwarty
    var plikHTML = "czasownikiNieregularne.html";

    // Zmienia aktualny adres URL na adres pliku HTML w tym samym folderze
    window.location.href = plikHTML;
}

function adjustTextareaHeight() {
    const textarea = document.getElementById("translationInput");
    textarea.style.height = "auto"; // Przywróć domyślną wysokość
    textarea.style.height = (textarea.scrollHeight) + "px"; // Ustaw nową wysokość na podstawie zawartości
}

// Wywołaj funkcję przy zmianie zawartości pola tekstowego
document.getElementById("translationInput").addEventListener("input", adjustTextareaHeight);

// Inicjalizacja, aby ustawić domyślną wysokość
adjustTextareaHeight();

function checkOnClick() {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300 || lastClickTime == -1) {
        // Jeśli czas między kliknięciami jest mniejszy niż 300 ms, wykonaj coś innego
        nextFlashcard();
    } else {
        // W przeciwnym razie wykonaj standardową akcję
        checkTranslation();
    }

    lastClickTime = currentTime;
}