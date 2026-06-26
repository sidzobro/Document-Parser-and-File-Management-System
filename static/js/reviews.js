document.addEventListener("DOMContentLoaded", function () {

    // Clears any previously stored reviews from local storage
    // For testting purpose, this just resets to a brand new version again.
    localStorage.removeItem("reviews");
    
        // Button used to submit a review or question
        const submitBtn = document.getElementById("submitReview");
    
        // Container where all reviews/questions will be displayed
        const reviewsList = document.getElementById("reviewsList");
    
        // Elements used for displaying review summary information
        const avgRatingEl = document.getElementById("avgRating");
        const reviewCountEl = document.getElementById("reviewCount");
        const ratingBarsEl = document.getElementById("ratingBars");
    
        // Star rating input container
        const starInput = document.getElementById("starInput");
    
        // Hidden input used to store selected rating value
        const ratingInput = document.getElementById("reviewRating");
    
        // Buttons used to switch between "Question" mode and "Review" mode
        const askBtn = document.getElementById("askQuestionBtn");
        const reviewBtn = document.getElementById("leaveReviewBtn");
    
        // Main review form container
        const reviewForm = document.querySelector(".review-form");
    
        // Title displayed at the top of the form
        const formTitle = document.getElementById("formModeTitle");
    
        // Placeholder message shown when there are no reviews
        const placeholder = document.getElementById("reviewsEmpty");
    
        // Stores the currently selected star rating
        let selectedRating = 0;
    
        // Keeps track of whether the form is in review mode or question mode
        let formMode = "review";
    
        // Stores IDs of answer boxes currently opened
        let openAnswerBoxes = new Set();
    
        // Mode Switching Section, Handles switching between:
        //Review Mode & Question Mode
    
        function updateFormUI() {
    
            // Removes active styling from both buttons
            askBtn.classList.remove("active");
            reviewBtn.classList.remove("active");
    
            // If the form is currently in question mode
            if (formMode === "question") {
    
                // Adds question-mode style
                reviewForm.classList.add("question-mode");
    
                // Hides the star rating section
                starInput.style.display = "none";
    
                // Highlights the Ask Question button
                askBtn.classList.add("active");
    
                // Updates form title text
                if (formTitle) formTitle.textContent = "Ask a Question";
    
            } else {
    
                // Removes question-mode style
                reviewForm.classList.remove("question-mode");
    
                // Shows the star rating section
                starInput.style.display = "flex";
    
                // Highlights the Review button
                reviewBtn.classList.add("active");
    
                // Updates form title text
                if (formTitle) formTitle.textContent = "Write a Review";
            }
        }
    
        // Switches form into question mode when "Ask a Question" button is clicked
        askBtn.addEventListener("click", () => {
            formMode = "question";
            updateFormUI();
        });
    
        // Switches form into review mode when "Write a Review" button is clicked
        reviewBtn.addEventListener("click", () => {
            formMode = "review";
            updateFormUI();
        });
    
        // Local Storage Functions (Used to save and retrieve reviews)
    
        // Retrieves reviews from browsers local storage
        function getReviews() {
            return JSON.parse(localStorage.getItem("reviews")) || [];
        }
    
        // Saves updated reviews back into local storage
        function saveReviews(reviews) {
            localStorage.setItem("reviews", JSON.stringify(reviews));
        }
    
        //Star Display Functions/Generates full and half stars
    
        function getStars(rating) {
            let stars = "";
    
            // Loops through 5 stars
            for (let i = 1; i <= 5; i++) {
    
                let className = "";
    
                // Full star condition
                if (rating >= i) {
                    className = "filled";
    
                // Half star condition
                } else if (rating >= i - 0.5) {
                    className = "half";
                }
    
                // Creates SVG star icon
                stars += `
                    <svg class="star ${className}" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                `;
            }
    
            return stars;
        }
    
        // Generates stars specifically for average rating display
        function getAverageStars(avg) {
            let stars = "";
    
            for (let i = 1; i <= 5; i++) {
    
                let className = "";
    
                if (avg >= i) {
                    className = "filled";
                } else if (avg >= i - 0.5) {
                    className = "half";
                }
    
                stars += `
                    <svg class="star ${className}" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                `;
            }
    
            return stars;
        }
    
        // Interactive Star Input, Supports:
        // Left click = full star & Right click = half star
        
    
        function renderStarInput(rating = 0) {
    
            // Stops function if star container does not exist
            if (!starInput) return;
    
            // Clears existing stars before re-rendering
            starInput.innerHTML = "";
    
            // Creates 5 stars dynamically
            for (let i = 1; i <= 5; i++) {
    
                /* SVG element was very important as it is basically a graphic or shape 
                that is drawn directly in the webpage using code rather than having to use an image file */

                // Creates SVG element
                const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
                // Sets SVG view box size
                star.setAttribute("viewBox", "0 0 24 24");
    
                // Adds star class
                star.classList.add("star");
    
                // Determines if star should be full or half
                let full = rating >= i;
                let half = !full && rating >= i - 0.5;
    
                if (full) star.classList.add("filled");
                else if (half) star.classList.add("half");
    
                // Inserts star shape
                star.innerHTML = `
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                `;
    
                // Left click sets a full star rating
                star.addEventListener("click", (e) => {
                    e.preventDefault();
    
                    selectedRating = i;
    
                    // Saves rating value
                    ratingInput.value = selectedRating;
    
                    // Re-renders stars visually
                    renderStarInput(selectedRating);
                });
    
                // Right click sets a half-star rating
                star.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
    
                    selectedRating = i - 0.5;
    
                    ratingInput.value = selectedRating;
    
                    renderStarInput(selectedRating);
                });
    
                // Adds star into star input container
                starInput.appendChild(star);
            }
        }
    
        // Reviews Summary Section, Calculates:
        // Average rating, Review count & Rating distribution
        
    
        function renderSummary(reviews) {
    
            // Only includes entries that are marked as reviews
            const onlyReviews = reviews.filter(r => r.type === "review");
    
            // Counts total reviews
            const total = onlyReviews.length;
    
            // If there are no reviews
            if (total === 0) {
    
                avgRatingEl.textContent = "0.0";
                reviewCountEl.textContent = "No reviews yet";
                ratingBarsEl.innerHTML = "";
    
                return;
            }
    
            // Calculates average rating
            const avg = onlyReviews.reduce((sum, r) => sum + r.rating, 0) / total;
    
            // Displays average stars visually
            avgRatingEl.innerHTML = `<div class="avg-stars">${getAverageStars(avg)}</div>`;
    
            // Displays total review count
            reviewCountEl.textContent = `${total} reviews`;
    
            // Objects used to count each star rating
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
            // Counts how many reviews belong to each rating
            onlyReviews.forEach(r => {
                const rounded = Math.floor(r.rating);
    
                if (counts[rounded] !== undefined) {
                    counts[rounded]++;
                }
            });
    
            // Clears existing rating bars
            ratingBarsEl.innerHTML = "";
    
            // Creates rating summary rows from 5 stars to 1 star
            [5, 4, 3, 2, 1].forEach(star => {
                ratingBarsEl.innerHTML += `
                    <div class="star-row">
                        <div class="stars">${getStars(star)}</div>
                        <span class="count">(${counts[star]})</span>
                    </div>
                `;
            });
        }
    
        // Rendering Reviews & Questions
        
    
        function loadReviews() {
    
            // Gets all reviews from storage
            const reviews = getReviews();
    
            // Clears displayed review list before reloading
            reviewsList.innerHTML = "";
    
            // Shows placeholder message if there are no reviews
            if (placeholder) {
                placeholder.style.display = reviews.length === 0 ? "block" : "none";
            }
    
            // Loops through each review/question
            reviews.forEach(r => {
    
                // Creates review card container
                const div = document.createElement("div");
    
                div.classList.add("review-card");
    
                // Adds special styling if entry is a question
                if (r.type === "question") {
                    div.classList.add("question-card");
                }
    
                let answersHTML = "";
    
                // Checks if question contains answers
                if (r.type === "question" && Array.isArray(r.answers) && r.answers.length > 0) {
    
                    // Generates answer HTML dynamically
                    answersHTML = `
                        <div class="answers">
                            ${r.answers.map(a => `
                                <div class="answer">
                                    <strong>${a.name}:</strong> ${a.text}
                                </div>
                            `).join("")}
                        </div>
                    `;
                }
    
                // Creates review/question card HTML
                div.innerHTML = `
                    <div class="review-top">
                        <span class="review-name">${r.name}</span>
                        ${
                            r.type === "review"
                            ? `<div class="review-rating">${getStars(r.rating)}</div>`
                            : `<span class="question-label">Question</span>`
                        }
                    </div>
    
                    <p>${r.text}</p>
    
                    ${
                        r.type === "question"
                        ? `
                            <button class="answer-btn" data-id="${r.id}">Answer</button>
    
                            <div class="answer-box" id="answer-box-${r.id}" 
                            style="display:${openAnswerBoxes.has(String(r.id)) ? "block" : "none"};">
    
                                <input type="text" placeholder="Your name" class="answer-name">
                                <textarea placeholder="Write your answer..." class="answer-text"></textarea>
                                <button class="submit-answer" data-id="${r.id}">Submit Answer</button>
                            </div>
                        `
                        : ""
                    }
    
                    ${answersHTML}
                `;
    
                // Adds review card to the page
                reviewsList.appendChild(div);
            });
    
            // Updates review summary section
            renderSummary(reviews);
        }
    
        //Global Click Handlers, Handles:
        // Opening answer boxes & Submitting answers
    
        document.addEventListener("click", function (e) {
    
            // Checks if Answer button was clicked
            if (e.target.classList.contains("answer-btn")) {
    
                const id = e.target.dataset.id;
    
                const box = document.getElementById(`answer-box-${id}`);
    
                if (!box) return;
    
                // Toggles answer box visibility
                if (openAnswerBoxes.has(id)) {
    
                    openAnswerBoxes.delete(id);
                    box.style.display = "none";
    
                } else {
    
                    openAnswerBoxes.add(id);
                    box.style.display = "block";
                }
            }
    
            // Checks if Submit Answer button was clicked
            if (e.target.classList.contains("submit-answer")) {
    
                const id = e.target.dataset.id;
    
                const box = document.getElementById(`answer-box-${id}`);
    
                if (!box) return;
    
                // Retrieves user answer input values
                const name = box.querySelector(".answer-name").value.trim();
                const text = box.querySelector(".answer-text").value.trim();
    
                // Prevents empty submissions
                if (!name || !text) {
                    alert("Fill in all fields");
                    return;
                }
    
                // Retrieves stored reviews
                const reviews = getReviews();
    
                // Finds matching question
                const question = reviews.find(r => String(r.id) === String(id));
    
                if (!question) return;
    
                // Ensures answers array exists
                if (!Array.isArray(question.answers)) {
                    question.answers = [];
                }
    
                // Adds new answer into answers array
                question.answers.push({ name, text });
    
                // Saves updated reviews
                saveReviews(reviews);
    
                // Keeps answer box open after submission
                openAnswerBoxes.add(String(id));
    
                // Reloads reviews visually
                loadReviews();
            }
        });
    
        // Main Submit Section, Handles:
        // Review submission & Question submission
        
    
        // Renders empty star input initially
        renderStarInput(0);
    
        // Applies correct form styling
        updateFormUI();
    
        // Submits button click event
        submitBtn.addEventListener("click", function () {
    
            // Retrieves input values
            const name = document.getElementById("reviewName").value.trim();
            const text = document.getElementById("reviewText").value.trim();
            const rating = parseFloat(ratingInput.value);
    
            // Prevents empty fields
            if (!name || !text) {
                alert("Please fill in all fields");
                return;
            }
    
            // Prevents reviews without ratings
            if (formMode === "review" && (!rating || rating === 0)) {
                alert("Please select a star rating");
                return;
            }
    
            // Retrieves existing reviews
            const reviews = getReviews();
    
            // Adds new review/question object
            reviews.push({
                id: Date.now(),
    
                // User name
                name,
    
                // Review or question text
                text,
    
                // Stores rating only if type is review
                rating: formMode === "review" ? rating : null,
    
                // Stores whether entry is a review or question
                type: formMode,
    
                // Questions contain answers array
                answers: formMode === "question" ? [] : null
            });
    
            // Saves updated reviews
            saveReviews(reviews);
    
            // Clears input fields after submission
            document.getElementById("reviewName").value = "";
            document.getElementById("reviewText").value = "";
    
            // Resets selected rating
            selectedRating = 0;
    
            // Resets star display
            renderStarInput(0);
    
            // Reloads reviews on screen
            loadReviews();
        });
    
        // Loads existing reviews when page first opens
        loadReviews();
    });