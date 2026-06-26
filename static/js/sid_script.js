document.addEventListener("DOMContentLoaded", function () {

    // Selects all elements that contain the class name "nav"
    const navItems = document.querySelectorAll(".nav");

    // Loops through each navigation item
    navItems.forEach(item => {

        // Adds a click event listener to each navigation item
        item.addEventListener("click", function () {

            // Gets the page link stored inside the "data page" attribute
            const page = item.getAttribute("data-page");

            // Redirects the user to the selected page
            window.location.href = page;
        });
    });

    // Selects the AI assistant bubble element
    const aiBubble = document.getElementById("aiAssistant");

    // Checks if the AI assistant exists on the page
if(aiBubble){

    // Selects the content area inside the AI assistant
    const aiContent = aiBubble.querySelector(".ai-content");

    // Selects the answer display box
    const answerBox = aiBubble.querySelector(".answer-box");

    // Opens or closes the AI assistant when the bubble is clicked
    aiBubble.addEventListener("click", () => {

        // Toggles the "open" class on the AI assistant
        aiBubble.classList.toggle("open");

        // Shows or hides the AI content depending on whether it is open
        aiContent.style.display = aiBubble.classList.contains("open") ? "block" : "none";
    });

    // Selects all questions elements inside the AI assistant
    const questions = aiBubble.querySelectorAll(".question");

    // Loops through each question
    questions.forEach(q => {

        // Adds click event listener to each question
        q.addEventListener("click", (e) => {

            // Prevents the click event from bubbling to the parent element
            e.stopPropagation();

            // Variable used to store the answer text
            let text = "";

            // Checks which question the user clicked
            switch(q.textContent){

                // If the question is about parsing documents
                case "How to parse a document?":
                    text = "Click 'Parse Document' box on the left panel, then upload files and save it to your desired location.";
                    break;

                // If the question is about saved files
                case "Where are saved files?":
                    text = "Your saved documents appear in the 'Saved Documents' box or the location you picked on your PC.";
                    break;

                // If the question is about changing language
                case "Change language?":
                    text = "Click the 'Language' box to select a preferred language.";
                    break;

                // If the question is about updating account information
                case "Update account info?":
                    text = "Click 'Account' to update your profile information.";
                    break;

                // Default message if no matching question is found
                default:
                    text = "Select a question to see the answer.";
            }

            // Displays the selected answer inside the answer box
            answerBox.textContent = text;
        });
    });

    // Detects clicks anywhere on the document
    document.addEventListener("click", function(e) {

        // Closes the AI assistant if it is open and the click happened outside it
        if(aiBubble.classList.contains("open") && !aiBubble.contains(e.target)) {

            // Removes the "open" class
            aiBubble.classList.remove("open");

            // Hides the AI content section
            aiContent.style.display = "none";
        }
    });
}
});

// Waits until the HTML document is fully loaded
document.addEventListener("DOMContentLoaded",  function(){

    // Selects navigation buttons by their IDs
    const toSettings = document.getElementById("settingsButton");
    const toMain = document.getElementById("mainMenuButton");
    const toAccounts = document.getElementById("accountButton");
    const toParseDocument = document.getElementById("ParseButton")
    const toSavedDocs = document.getElementById("savedDocsButton")

    // Redirects user to the settings page when clicked
    toSettings.addEventListener("click", function(){
        window.location.href = "/settings"
    });

    // Redirects user to the main menu page
    toMain.addEventListener("click", function(){
        window.location.href = "/sid"
    });

    // Redirects user to the accounts page
    toAccounts.addEventListener("click", function(){
        window.location.href = "/accounts"
    });

     // Redirects user to the upload/parse document page
    //   toParseDocument.addEventListener("click", function(){
    //     window.location.href = "/upload"
    //   })

    // Redirects user to the saved documents page
    toSavedDocs.addEventListener("click", function(){
        window.location.href = "/savedDocumentsPage"
    })
});

function openPopup()
{
    document.getElementById("popupBack").style.display = "block";
}

function closePopup()
{
    document.getElementById("popupBack").style.display = "none";
}