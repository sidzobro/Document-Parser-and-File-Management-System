console.log("js loaded");

const loginButton = document.getElementById("loginButton");

if (loginButton) {
    loginButton.addEventListener("click", loginHandler);
}

// Modal elements
const modal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalConfirmButton = document.getElementById("modalConfirm");

// Login function
function loginHandler(e) {
    e.preventDefault();

    //setting local variables to get the username and password entered by the user
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    //converting inputs to json, communicating the content with the API 
    //which gets information from the database manager that holds the information 
    //required to match the input to the database
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        //if the input matches whats in the database, upon logging in the user will be redirected to the main page
        if (data.success) {

            // Redirect after successful login
            window.location.href = "/sid";

        } else {

            // Failed login popup shows a modal box telling you that your entered credentials may be wrong
            showModal(
                "Login Failed",
                "Incorrect email or password. Please try again."
            );
        }
    })
    .catch(function(error) {
        console.log("Login error:", error);

        showModal(
            "Server Error",
            "Unable to connect to the server."
        );
    });
}

// Show modal function
function showModal(title, message) {

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.remove("hidden");
}

// Close modal
if (modalConfirmButton) {
    modalConfirmButton.addEventListener("click", function() {
        modal.classList.add("hidden");
    });
}



// OLD JS CODE FOR MODAL PUT HERE JUST IN CASE CASEY BREAKS EVERYTHING (Please blame John instead if things go wrong, casey is just a poor innocent soul who can do no wrong)
//update, it worked. Thanks Casey :)
// .then(function(data) {
//         if(data.success) {
//             showModal({
//                 // Successful login attempt box for debugging
//                 title: "Login Success",
//                 message: "credentials recognised! Login Success!",
//                 type: "login check",
//                 onConfirm: () => {
//                     return render_template('sid_html.html')
//                 }

//             })
//         } else{
//             showModal({
//                 // Successful login attempt box for debugging
//                 title: "Login Failed",
//                 message: "Please re-enter your credentials",
//                 type: "login check"
//             });
//         }
//     }) 