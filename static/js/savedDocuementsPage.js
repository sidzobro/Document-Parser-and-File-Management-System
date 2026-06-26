// JS that displays a count of the number of selected files next to the upload button
const chosenFiles = document.getElementById("SelectFileSavedDocPage");
const fileCountDisplay = document.getElementById("fileNameDisplay");

chosenFiles.addEventListener("change", function() {
    const numOfFiles = this.files.length;
    // If there are no selcted files --- Defult State
    if (numOfFiles === 0) {
        fileCountDisplay.textContent = "No files selected";
    }

    // For one file it will display their name next to the text "selected"
    else if (numOfFiles === 1) {
        fileCountDisplay.textContent = this.files[0].name + " selected";
    }

    // When more than one file is selected, it will just show the number of files, not their name, plus "files selected"
    else {
        fileCountDisplay.textContent = numOfFiles + " files selected";
    }
});

// Handles the documents section of the page - Includes: Files, Folders and popup modals
document.addEventListener("DOMContentLoaded", function () {

    const listOfDocuments = document.querySelector(".DocumentList");
    const uploadBtn = document.getElementById("UploadButtonSavedDocPage");
    const inputAFile = document.getElementById("SelectFileSavedDocPage");
    const folderList = document.querySelector(".FolderList");
    const filterBtn = document.getElementById("FilterButton");
    const filterDropdown = document.querySelector(".FilterDropdown");
    const searchBar = document.getElementById("SearchBar");
    const searchButton = document.getElementById("SearchButton");
    const filterCheckboxes = filterDropdown.querySelectorAll('input[type="checkbox"]');

    let openMenu = null; // Global variable to track the currently open menu

    // JS that handles the dropdown menu for the filter button
    filterBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        filterDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!filterDropdown.contains(event.target) && !filterBtn.contains(event.target)) {
            filterDropdown.classList.remove("show");
        }  
    });

    // To allow for the searching and filtering of documents
    function filterDocuments() {
        const searchText = searchBar.value.toLowerCase().trim();

        const selectedFilters = [...filterCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());
        
        const documents = listOfDocuments.querySelectorAll(".DocumentItem");

        documents.forEach(doc => {

            const fileName = doc.dataset.fileName.toLowerCase();
            const fileType = doc.dataset.fileType.toLowerCase();

            // This section allows for the filtering to work with the current filter options on display
            let normalizedType = fileType;

            if (["doc", "docx"].includes(fileType)) {
                normalizedType = "word";
            }
            else if (["xls", "xlsx"].includes(fileType)) {
                normalizedType = "excel";
            }
            else if (["ppt", "pptx"].includes(fileType)) {
                normalizedType = "powerpoint";
            }
            else if (["jgp", "jpeg", "png"].includes(fileType)) {
                normalizedType = "image";
            }
            // End of section for making filtering options work


            const matchesSearch = fileName.includes(searchText);

            const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(fileType);

            if (matchesSearch && matchesFilter) {
                doc.style.display = "";
            } else {
                doc.style.display = "none";
            }
        });

        // Checks if nothing is dispkyaing
        checkFilteredEmpty();
    }

    // Makes the search button operate
    searchButton.addEventListener("click", filterDocuments);

    // Makes the search update as the user types
    searchBar.addEventListener("input", filterDocuments);

    // Lets the user hit the enter key to search
    searchBar.addEventListener("keypress", function(e){
        if (e.key === "Enter") {
            filterDocuments();
        }
    });

    // Allows the filter buttons to instantly begin filtering what the user sees
    filterCheckboxes.forEach(cb => {
        cb.addEventListener("change", filterDocuments);
    });

    // ---------------Folders Section --------------------

    // This section will handle the folders and how they look
    function createFolder(folderName) {
        const folder = document.createElement("div");
        folder.className = "FolderItem";
        folder.setAttribute("draggable", true);

        folder.innerHTML = `
            <div class="FolderInfo">
                <i class="fa-solid fa-folder FolderIcon"></i>
                <span class="FolderName" title="${folderName}">${formatFileName(folderName)}</span>
            </div>

            <button class="FolderKebab" title="Click to open all options for your folder">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <div class="FolderMenu hidden">
                <div class="FolderOption rename" title="Click to rename the folder">Rename</div>
                <div class="FolderOption favorite" title="Click to mark the folder as a favorite">Favorite</div>
                <div class="FolderOption delete" title="Click to delete the folder">Delete</div>
            </div>
        `;

        return folder
    }

    // This section handles Folder creation
    let folderCount = 0;

    const createFolderBtn = document.querySelector(".CreateFolderBtn");

    createFolderBtn.addEventListener("click", function() {
        folderCount++;
        const newFolder = createFolder(`Folder ${folderCount}`);
        folderList.appendChild(newFolder)

        // Temp popup modal to let the user know this feature is incomplete, this would be finished if I had more time and technical knowlege
        showModal({
            title: "Feature Incomplete",
            message: "My apologies, this feature is not fully operational. This feature would have allowed the user to save files to specific folders to make organisation easier. You can currently create, rename, reorder, fav and delete the folders, but cannot open or access them. This feature will be added in future versions of this website.",
            type: "info"
        });
    });

    // This gives the recycle bin button a modal popup like with the folder creation above, this is TEMPORARY and only here as I did not have time to complete this feature
    const recycleBinBtn = document.getElementById("RecycleBinBtn");

    if(recycleBinBtn){
        recycleBinBtn.addEventListener("click", function() {
            showModal({
                title: "Feature Incomplete",
                message:"My apologies, this feature is not fully implemnted due to time constraints. This button would have let you open a new page, where all files that had been deleted would be stored for 30 days before being removed completely. The user would have been able to restore the files to their original location, or delete them fully before the end of the 30 days. This feature will be implemented in future versions of the website.",
                type: "info"
            });
        });
    }

    // Makes the rename folder button change the name
    function enableFolderRename(nameElement){
        const currentName = nameElement.title || nameElement.textContent;

            const input = document.createElement("input");
            input.type = "text";
            input.value = currentName;
            input.className = "FolderRenameInput";

            nameElement.replaceWith(input);

            input.focus();
            input.select();

            function saveRename() {
                const newName = input.value.trim() || currentName;
                const span = document.createElement("span");
                span.className = "FolderName";
                span.textContent = formatFileName(newName);
                span.title = newName;
                input.replaceWith(span);
            }

            input.addEventListener("blur", saveRename);
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") input.blur();
            });
    }

    // Allows the user to rename the folder by double clicking on the text/title
    folderList.addEventListener("dblclick", function (e) {
        const nameElement = e.target.closest(".FolderName");
        if (!nameElement) return;
        enableFolderRename(nameElement);
    });

    // Allow the folders to be dragged
    let draggedFolder = null;
    folderList.addEventListener("dragstart", function (e) {
        const folder = e.target.closest(".FolderItem");
        if (!folder) return;
        draggedFolder = folder;
    });

    folderList.addEventListener("dragover", function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(folderList, e.clientY);
        if (afterElement == null) {
            folderList.appendChild(draggedFolder);
        } else {
            folderList.insertBefore(draggedFolder, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const elements = [...container.querySelectorAll(".FolderItem:not(.dragging)")];

        return elements.reduce((closest, child) => {

            const box = child.getBoundingClientRect();

            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child};
            } else {
                return closest;
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element;
    }

    // JS to open the options menu for the folders
    folderList.addEventListener("click", function(e) {
        const folderItem = e.target.closest(".FolderItem");
        if (!folderItem) return;
         // Clicking on the folder makes it a fav
        if (e.target.closest(".FolderIcon")) {
            folderItem.classList.toggle("favorited");
            if(folderItem.classList.contains("favorited")) {
                folderList.prepend(folderItem);
            }
        }

        const menu = folderItem.querySelector(".FolderMenu");

        // Togges the menu open
        if (e.target.closest(".FolderKebab")) {
            e.stopPropagation();
            const rect = folderItem.querySelector(".FolderKebab").getBoundingClientRect();

            // Close other menus that are open
            if (openMenu && openMenu !== menu) {
                openMenu.classList.add("hidden");
            }

            //Toggle curret menu
            menu.classList.remove("hidden");
            openMenu = menu.classList.contains("hidden") ? null : menu;
            return;
        }

        // rename option
        if (e.target.classList.contains("rename")) {
            // Code to close the dropdown menu if this option is selected
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            // Allows the user to start renaming the folder
            const nameElement = folderItem.querySelector(".FolderName");
            if (nameElement) {
                enableFolderRename(nameElement);
            }
        }

        // Delete option (Connects to the modal function)
        if (e.target.classList.contains("delete")) {
            showModal({
                title: "Confirm Deletion",
                message:  "Are you sure you want to delete this folder?",
                type: "danger",
                confirmText: "Delete",
                showCancel: true,
                onConfirm: () =>  folderItem.remove()
            });
        }

        // Fav option
        if (e.target.classList.contains("favorite")) {
            // Closes the dropdown menu if this option is selected
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            folderItem.classList.toggle("favorited");

            if(folderItem.classList.contains("favorited")) {
                folderList.prepend(folderItem);
            }
        }
    });

    // Adds a right click option to open the menu for folders
    folderList.addEventListener("contextmenu", function (e) {
        const folderItem = e.target.closest(".FolderItem");
        if (!folderItem) return;

        e.preventDefault();

        const menu = folderItem.querySelector(".FolderMenu");

        if (openMenu && openMenu !== menu) {
            openMenu.classList.add("hidden");
        }

        menu.classList.remove("hidden");
        openMenu = menu.classList.contains("hidden") ? null : menu;
    });

    // --------------- END OF FOLDER SECTION ----------------

    //------------------Files Section-------------

    // Global varibles to help with multi selection later
    let selectedDocuments = new Set();
    let lastSelected = null;

    // Assigns an icon based off the filetype
    function getIcon(fileName){
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1).trim().toLowerCase();
        // Assigns images to the following filetypes
        const iconMap = {
            pdf: "fa-file-pdf",
            doc: "fa-file-word",
            docx: "fa-file-word",
            xls: "fa-file-excel",
            xlsx: "fa-file-excel",
            ppt: "fa-file-powerpoint",
            pptx: "fa-file-powerpoint",
            txt: "fa-file-lines",
            eml: "fa-envelope",
            png: "fa-file-image",
            jpg: "fa-file-image",
            jpeg: "fa-file-image"
        };

    return iconMap[extension] || "fa-file";
    }

    // Sets the max length of the file names to 20 charecters
    function formatFileName(name, maxLength = 25) {
        if (name.length <= maxLength) return name;

        const lastDot = name.lastIndexOf(".");

        // If there is no dot, just cut off the name and add "..."
        if (lastDot === -1) {
            return name.substring(0, maxLength - 3) + "...";
        }

        const extension = name.substring(lastDot);
        const nameOnly = name.substring(0, lastDot);

        let allowedLength = maxLength - extension.length - 3;

        // To stop the name from becoming too small
        if (allowedLength < 5) {
            allowedLength = 5;
        }
        return nameOnly.substring(0, allowedLength) + "..." + extension;
    }

    // Handles the empty state display for the documents section
    function displayEmptyState() {
        const emptyDoc = document.createElement("div");
        emptyDoc.className = "EmptyDocumentList";
        emptyDoc.innerHTML = "<p>Either no documents uploaded yet, or no documents match your search/filter. Please use the upload button to add your documents here, or widen your search/filtering.</p>";
        listOfDocuments.appendChild(emptyDoc);
    }

    // Gets rid of the empty state display when something is uploaded to the documents section
    function removeEmptyState() {
        const emptyState = listOfDocuments.querySelector(".EmptyDocumentList");
        if (emptyState) emptyState.remove();
    }

    // Checks if the number of documents is equal to zero, and makes the empty state show if so
    function checkEmpty() {
        const items = listOfDocuments.querySelectorAll(".DocumentItem");
        if (items.length === 0) {
            displayEmptyState();
        }
    }

    // Checks if the search/filtering hasnt turned up any results
    function checkFilteredEmpty() {
        const visibleDocs = [...listOfDocuments.querySelectorAll(".DocumentItems")]
            .filter(doc => doc.style.display !== "none");

        const existingEmpty = listOfDocuments.querySelector(".EmptyDocumentList");

        if (visibleDocs.lentgh ===0) {
            if (!existingEmpty) {
                displayEmptyState();
            }
        } else {
            removeEmptyState();
        }
    }

    // This section will handle the documents and how they function
    function createDocumentElement(docData) {

        // Test log remove later
        console.log("Creating document:", docData);
        
        const fileName = docData.job_name;

        const element = document.createElement("div");
        
        element.className = "DocumentItem";

        // To make sure that the document loads as a fav
        if (docData.is_favorite) {
            element.classList.add("favorited");
        }

        element.setAttribute("draggable", true);

        element.dataset.fileName = docData.job_name;
        element.dataset.filePath = docData.file_path;
        element.dataset.fileId = docData.jid;
        element.dataset.fileType = docData.docu_type;
        element.dataset.fileSize = docData.docu_size;
        element.dataset.dateCreated = docData.date_created;

        // Sets the HTML for the file
        element.innerHTML =  `
            <button class="FavIcon" title="Favorite this File">
                <i class="${docData.is_favorite ? 'fa-solid' : 'fa-regular'} fa-heart HeartIcon"
                style="${docData.is_favorite ? 'color:red;' : ''}">
                </i>
            </button>

            <button class="KebabIcon" title="Click to open all file options">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <div class="DocumentMenu hidden">
                <div class="DocOption preview" title="Click to preview the file">Preview</div>
                <div class="DocOption download" title="Click to download the file">Download</div>
                <div class="DocOption rename" title="Click to rename the file">Rename</div>
                <div class="DocOption favorite" title="Click to mark the file as a favorite">Favorite</div>
                <div class="DocOption delete" title="Click to delete the file">Delete</div>
                <div class="DocOption restore" title="Click to restore the file">Restore</div>
                <div class="DocOption convert" title="Click to convert the file">Convert</div>
                <div class="DocOption memo" title="Click to add a memo to the file">Add Memo</div>
                <div class="DocOption info" title="Click to view file information">File Info</div>
            </div>

            <div class="DocumentIcon">
                <i class="fa-solid ${getIcon(fileName)}"></i>
            </div>

            <div class="DocumentInfo">
                <span class="DocumentName" title="${fileName}">
                    ${formatFileName(fileName)}
                </span>
            </div>

            <div class="DocumentActions">
                <button class="PreviewButton" title="Preview File">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>

                <button class="DownloadButton" title="Download File">
                    <i class="fa-solid fa-download"></i>
                </button>

                <button class="DeleteButton" title="Delete File">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            `;

            return element;
    }

    // Adds the file
    function addDocument(doc) {
        removeEmptyState();
        
        const docElement = createDocumentElement(doc);

        // docElement.dataset.fileName = doc.job_name;
        // docElement.dataset.filePath = doc.file_path;
        // docElement.dataset.fileId = doc.jid;
        // docElement.dataset.fileType = doc.docu_type;
        // docElement.dataset.fileSize = doc.docu_size;
        // docElement.dataset.dateCreated = doc.date_created;

        listOfDocuments.appendChild(docElement);
    }

    // Makes the heart/fav icon turn red and moves the file to the top of the page
    async function toggleDocumentFavorite(documentItem) {
        const heartIcon = documentItem.querySelector(".HeartIcon");

        // Gte the file id from the dataset
        const fileId = documentItem.dataset.fileId;

        // determine new favorite state
        const willBeFav = !documentItem.classList.contains("favorited");

        try {
            // Send update to flask
            const response = await fetch(`/favoriteDocument/${fileId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    favorite: willBeFav
                })
            });

            const data = await response.json();

            // If flask update to fav succeeds
            if (data.success) {
                // Update the UI to reflect the fact that the file is now fav
                documentItem.classList.toggle("favorited");

                if (documentItem.classList.contains("favorited")) {
                    heartIcon.classList.remove("fa-regular");
                    heartIcon.classList.add("fa-solid");
                    heartIcon.style.color = "red";

                    // Move to the top!
                    listOfDocuments.prepend(documentItem);
                } else {
                    heartIcon.classList.remove("fa-solid");
                    heartIcon.classList.add("fa-regular");
                    heartIcon.style.color = "";
                }

            } else {
                showModal({
                    title: "Favorite Failed",
                    message: "Could not update favorite.",
                    type: "warning"
                });
            }
        } catch(error) {
            console.error("Favorite Error:", error);

            showModal({
                title: "Server Error",
                message: "Could not connect to server.",
                type: "danger"
            });
        }
    }

    // Manages the rename function for the files (Whie keeping the file extention)
    function enableDocumentRename(documentItem) {
        const nameSpan = documentItem.querySelector(".DocumentName");
        const fullName = documentItem.dataset.fileName;
        const lastDot = fullName.lastIndexOf(".");
        const nameOnly = fullName.substring(0, lastDot);
        const extension = fullName.substring(lastDot);
        const input =document.createElement("input");

        input.type = "text";
        input.value = nameOnly;
        input.className = "DocumentRenameInput";

        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        // To save the new name
        async function saveRename() {
            const newName = input.value.trim() || nameOnly;

            // Keep extension
            const fullNewName = newName + extension;

            const fileId = documentItem.dataset.fileId;

            try {

                const response = await fetch(`/renameDocument/${fileId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        new_name: fullNewName
                    })
                });

                const data = await response.json();

                if (data.success) {

                    const span = document.createElement("span");
                    span.className = "DocumentName";

                    // Update dataset
                    documentItem.dataset.fileName = fullNewName;

                    // Update UI
                    span.textContent = formatFileName(fullNewName);
                    span.title = fullNewName;

                    input.replaceWith(span);

                    showModal({
                        title: "Rename Successful",
                        message: `File renamed to "${fullNewName}"`,
                        type: "success"
                    });

                } else {

                    showModal({
                        title: "Rename Failed",
                        message: data.message || "Could not rename file.",
                        type: "warning"
                    });

                    input.focus();
                }

            } catch(error) {

                console.error("Rename Error:", error);

                showModal({
                    title: "Server Error",
                    message: "Could not connect to server.",
                    type: "danger"
                });
            }
        }
    
    input.addEventListener("blur", saveRename);
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            input.blur();
        }
    });


    } // Why? CHECKTHIS

    // Double click option to rename a file
    listOfDocuments.addEventListener("dblclick", function (e) {
        const nameElement = e.target.closest(".DocumentName");
        if (!nameElement) return;

        const documentItem = nameElement.closest(".DocumentItem");

        if (!documentItem) return;

        enableDocumentRename(documentItem);
    });

    // To make the files draggable
    let draggedDocument = null;

    listOfDocuments.addEventListener("dragstart", function (e) {
        const documentItem = e.target.closest(".DocumentItem");
        if (!documentItem) return;

        draggedDocument = documentItem;

        documentItem.classList.add("dragging");
    });

    listOfDocuments.addEventListener("dragend", function (e) {
        const documentItem = e.target.closest(".DocumentItem");
        if (documentItem) documentItem.classList.remove("dragging");
    });

    listOfDocuments.addEventListener("dragover", function (e) {
        e.preventDefault();

        const afterElement = getDragAfterElement(listOfDocuments, e.clientY);
        if (afterElement == null) {
            listOfDocuments.appendChild(draggedDocument);
        } else {
            listOfDocuments.insertBefore(draggedDocument, afterElement);
        }
    });

    // This section will handle the events when a user selects a function (Download, delete etc)
    listOfDocuments.addEventListener("click", async function (e) {
        // To make sure the click is on a document item, and not the empty state or something else
        const documentItem = e.target.closest(".DocumentItem");
        if (!documentItem) return;

        // Fav/Heart Button
        if (e.target.closest(".FavIcon")) {
            toggleDocumentFavorite(documentItem);
        }

        // Kebab options menu
        if (e.target.closest(".KebabIcon")) {
            e.stopPropagation();
            const menu = documentItem.querySelector(".DocumentMenu");
            // Close other menus that are open
            if (openMenu && openMenu !== menu) {
                openMenu.classList.add("hidden");
                document.querySelectorAll(".DocumentItem").forEach(i => i.classList.remove("menu-open"));
            }

            documentItem.classList.add("menu-open");

            // Show the current file's menu
            menu.classList.remove("hidden");
            openMenu = menu.classList.contains("hidden") ? null : menu;

            return;
        }

        // --------- Kebab Menu Buttons -------

        // Rename
        if (e.target.classList.contains("rename")) {
            // Closes the dropdown menu if this option is selected
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }
            enableDocumentRename(documentItem);
        }

        // Fav from menu
        if (e.target.classList.contains("favorite")) {
            // Closes the dropdown menu if this option is selected
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }
            toggleDocumentFavorite(documentItem);
        }

        // Delete from menu
        if (e.target.classList.contains("delete")) {
            const fileName = documentItem.dataset.fileName;
            showModal({
                title: "Confirm Deletion",
                message: `Are you sure you want to delete "${fileName}"?`,
                type: "danger",
                confirmText: "Delete",
                showCancel: true,
                onConfirm: async () => {
                    
                    const fileId = documentItem.dataset.fileId;

                    try {
                        const response = await fetch(`/deleteDocument/${fileId}`, {
                            method: "DELETE"
                        });

                        const data = await response.json();

                        if (data.success) {
                            documentItem.remove();

                            checkEmpty();

                            showModal({
                                title: "Deleted",
                                message: "File delete successfully",
                                type: "success"
                            });
                        } else {
                            showModal({
                                title: "Delete Failed",
                                message: "Could not delete file",
                                type: "warning"
                            });
                        } 

                    } catch(error) {

                            console.error(error);

                            showModal({
                                title: "Server Error",
                                message: "Could not connect to server.",
                                type: "danger"
                            });
                        }
                    }
            });
        }

        // John code from 583 ->620
        // Preview will be used to look at the document that you are either going to parse/save
        if (e.target.classList.contains("preview")){
            if(openMenu){
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            const fileName = documentItem.dataset.fileName;
            const fileId = documentItem.dataset.fileId;
            const fileType = documentItem.dataset.fileType.toLowerCase();

            const previewUrl = `/previewDocument/${fileId}`;

            const imageTypes = [
                "png", "jpg", "jpeg"
            ];

            const pdfTypes = ["pdf"];

            // If not a pdf or an image, have this warning popup
            if(!imageTypes.includes(fileType) && !pdfTypes.includes(fileType)) {
                showModal({
                    title: "Preview not avalible",
                    message: "You can only preview PDF's or Images in the browser. All other types of files cannot be previewed.",
                    type: "warning"
                });
                return;
            }


            // Opens popup modal with a preview of the file, can only show PDF's or Images
            showModal({
                title: `Preview of ${fileName}`,
                message: `This is a preview of ${fileName}`,
                type: "info",

                showPreview: true,
                previewUrl: previewUrl,
                isImage: imageTypes.includes(fileType)
            });
        }

        // Download alert
        // Download is there so the user can look at the document that they're about to download and look at its file type
        // This should update as the document is restored as well
        if (e.target.classList.contains("download")){
            if(openMenu){
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            const fileName = documentItem.dataset.fileName;
            const fileId = documentItem.dataset.fileId;

            // Opens the popup modal to confirm the download, and then starts the download if confirmed (Not fully implemented yet, need help with this)
            showModal({
                title: `Download ${fileName}`,
                message: `Are you sure you want to download ${fileName}?`,
                type: "info",

                confirmText: "Download",
                showCancel: true,

                onConfirm: () => {
                    window.location.href = `/downloadDocument/${fileId}`;
                }
            });
        }

        // Popup modal for restor (MAY DELETE OPTION ENTIRELY DEPENDING ON TIME)
        if (e.target.classList.contains("restore")) {
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            const fileName = documentItem.dataset.fileName;
            showModal({
                title: "Restore",
                message: `File Restoration feature will be not be avalible for the end of this project. This feature may be added in future work to the project. :(.`,
                type: "info"
            });
        }

        // Popup Modal for converting the file (May delete due to time constraingts)
        if (e.target.classList.contains("convert")) {
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            const fileName = documentItem.dataset.fileName;

            showModal({
                title: "Convert File",
                message: `File conversion for " ${fileName}" will be not be avalible for the end of this project. This feature may be added in future work to the project. :(`,
                type: "danger"
            });
        }

        

        // Popup modal for memo
        if (e.target.classList.contains("memo")) {
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            const fileId = documentItem.dataset.fileId;
            const fileName = documentItem.dataset.fileName;

            try {

                // Grab existing memo from flask
                const response =await fetch(`/getMemo/${fileId}`);
                const data = await response.json();

                showModal({
                title: `Memo for ${fileName}`,
                type: "info",

                showMemo: true,
                memoText: data.memo || "",

                confirmText: "Save",
                showCancel: true,

                onConfirm: async () => {

                    try {
                        const saveResponse = await fetch(`/saveMemo/${fileId}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                memo: memoInput.value
                            })
                        });
                    
                    const saveData = await saveResponse.json();

                    if (saveData.success) {

                        showModal({
                            title: "Memo Saved",
                            message: "Your memo was saved successfully.",
                            type: "success"
                        });

                    } else {

                        showModal({
                            title: "Save Failed",
                            message: "Could not save memo.",
                            type: "warning"
                        });
                    }
                } catch(error) {
                    console.error(error);

                    showModal({
                        title: "Server Error",
                        message: "Could not connect to server.",
                        type: "danger"
                    });
                }
            }
            
        });

        } catch(error) {
            console.error(error);

            showModal({
                title: "Error",
                message: "Could not load memo.",
                type: "danger"
            });
        }
        }

        // Popup modal for file info
        if (e.target.classList.contains("info")) {
            if (openMenu) {
                openMenu.classList.add("hidden");
                openMenu = null;
            }

            // Grab the info from the dataset
            const fileName = documentItem.dataset.fileName; 
            const fileId = documentItem.dataset.fileId;
            const fileType = documentItem.dataset.fileType;
            const fileSize = documentItem.dataset.fileSize;
            const dateCreated = documentItem.dataset.dateCreated;

            // convert the file size bytes into KB or MB
            function formatFileSize(bytes) {
                bytes = Number(bytes);

                if (bytes < 1024) {
                    return bytes + " B";
                } else if (bytes < 1024 * 1024) {
                    return (bytes / 1024).toFixed(2) + " KB";
                } else {
                    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
                }
            }
            
            // The popup modal that will display all the info
            showModal({
                title: "File Info",
                message: `The full file Info for " ${fileName}" is: \n\n` +
                `File Name: ${fileName}\n\n` +
                `File Type: ${fileType}\n\n` +
                `File Size: ${formatFileSize(fileSize)}\n\n` +
                `Date Created: ${dateCreated}\n\n` +
                `File ID: ${fileId}\n\n` ,
                type: "info"
            });
        }

        // -------- Displayed Buttons ------

        // Preview Button
        if (e.target.closest(".PreviewButton")){
            const fileName = documentItem.dataset.fileName;
            const fileId = documentItem.dataset.fileId;
            const fileType = documentItem.dataset.fileType.toLowerCase();

            const previewUrl = `/previewDocument/${fileId}`;

            const imageTypes = [
                "png", "jpg", "jpeg"
            ];

            const pdfTypes = ["pdf"];

            // If not a pdf or an image, have this warning popup
            if(!imageTypes.includes(fileType) && !pdfTypes.includes(fileType)) {
                showModal({
                    title: "Preview not avalible",
                    message: "You can only preview PDF's or Images in the browser. All other types of files cannot be previewed.",
                    type: "warning"
                });
                return;
            }

            // Opens popup modal with a preview of the file, can only show PDF's or Images
            showModal({
                title: `Preview of ${fileName}`,
                message: `This is a preview of ${fileName}`,
                type: "info",

                showPreview: true,
                previewUrl: previewUrl,
                isImage: imageTypes.includes(fileType)
            });
        }

        // Download button
        if (e.target.closest(".DownloadButton")){
            const fileName = documentItem.dataset.fileName;
            const fileId = documentItem.dataset.fileId;

            // Opens the popup modal to confirm the download, and then starts the download if confirmed (Not fully implemented yet, need help with this)
            showModal({
                title: `Download ${fileName}`,
                message: `Are you sure you want to download ${fileName}?`,
                type: "info",

                confirmText: "Download",
                showCancel: true,

                onConfirm: () => {
                    window.location.href = `/downloadDocument/${fileId}`;
                }
            });
        }

        // Delete button
        if (e.target.closest(".DeleteButton")) {
            const fileName = documentItem.dataset.fileName;

            showModal({
                title: "Confirm Deletion",
                message: `Are you sure you want to delete "${fileName}"?`,
                type: "danger",
                confirmText: "Delete",
                showCancel: true,

                onConfirm: async () => {
                    const fileId = documentItem.dataset.fileId;
                    try {
                        const response = await fetch(`/deleteDocument/${fileId}`, {
                            method: "DELETE"
                        });
                        const data = await response.json();
                        if (data.success) {
                            documentItem.remove();
                            checkEmpty();
                            showModal({
                                title: "Deleted",
                                message: "File deleted successfully.",
                                type: "success"
                            });

                        } else {
                            showModal({
                                title: "Delete Failed",
                                message: "Could not delete file.",
                                type: "warning"
                            });
                        }
                    } catch(error) {
                        console.error("Delete Error:", error);
                        showModal({
                            title: "Server Error",
                            message: "Could not connect to server.",
                            type: "danger"
                        });
                    }
                }
            });
        }

        // Ignore clicks on interactive elements
        if (
            e.target.closest(".KebabIcon") ||
            e.target.closest(".DocumentMenu") ||
            e.target.closest(".FavIcon") ||
            e.target.closest(".PreviewButton") ||
            e.target.closest(".DownloadButton") ||
            e.target.closest(".DeleteButton")
        ) {
            return;
        }

        // Select file logic
        const items = [...listOfDocuments.querySelectorAll(".DocumentItem")];
        const currentItem = e.target.closest(".DocumentItem");

        // Shift click code
        if (e.shiftKey && lastSelected) {
            const start = items.indexOf(lastSelected);
            const end = items.indexOf(currentItem);
            const range = items.slice(Math.min(start, end), Math.max(start, end) + 1);

            selectedDocuments.forEach(item => item.classList.remove("selected"));
            selectedDocuments.clear();

            range.forEach(item => {
                item.classList.add("selected");
                selectedDocuments.add(item);
            });
        } else {
            // Normal click code
            selectedDocuments.forEach(item => item.classList.remove("selected"));
            selectedDocuments.clear();

            currentItem.classList.add("selected");
            selectedDocuments.add(currentItem);
            lastSelected = currentItem;
            }
    });

    // This manages the menu opening when a user right clicks on the document
    listOfDocuments.addEventListener("contextmenu", function (e) {
        e.preventDefault(); // Makes it so the browser menu will not open
        e.stopPropagation(); // To stop the event from also triggering the left click menu code above
        const documentItem = e.target.closest(".DocumentItem");
        if (!documentItem) return;

        const menu = documentItem.querySelector(".DocumentMenu");

        // Close other menus that are open
        if (openMenu && openMenu !== menu) {
            openMenu.classList.add("hidden");
        }

        // To show the current files menu
        menu.classList.remove("hidden");
        openMenu = menu;
    });

    // To unselect the file
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".DocumentItem")) {
            selectedDocuments.forEach(item => item.classList.remove("selected"));
            selectedDocuments.clear();
            lastSelected = null;
        }
    });

    // To open and close the Kebab menu
    document.addEventListener("click", function (e) {
        if (!openMenu) return;

        // If click inside the open menu dont do anything (Helps fix flickering)
        if (openMenu.contains(e.target)) return;

        // If clicking a button to open a menu dont do anything
        if (
            e.target.closest(".KebabIcon") ||
            e.target.closest(".FolderKebab")
        ) return;

        // Otherwise close the menu
        openMenu.classList.add("hidden");
        openMenu = null;
    });

    // --------- This section will handle uploads --------

    // ########## FILE UPLOADS #########

    // Limits the allowed file extentions that can be uploaded
    const allowedExtensions = [
        "pdf", "doc", "docx", "txt",
        "ppt", "pptx",
        "xls", "xlsx",
        "eml",
        "png", "jpg", "jpeg"
    ];

    // Upload button is clicked with files selected, calls uploadFilesToServer, which uploads the files
    uploadBtn.addEventListener("click", uploadFilesToServer);
    


    // ----------------- Universal Popup Modal JS (Buttons and dropdown menu options) --------------

    // These all grab the elements used or needed by the popup models 
    const modal = document.getElementById("confirmModal");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    const modalMessage = document.getElementById("modalMessage");
    const modalTitle = document.getElementById("modalTitle");
    const modalBox = document.getElementById("modalBox");
    const modalIcon = document.getElementById("modalIcon");

    // Constant for opening the memo input box (WHere the user can type)
    const memoInput = document.getElementById("memoInput");
    console.log("memoInput:", memoInput);

    // Constants for previewing PDF and Image files
    const previewContainer = document.getElementById("previewContainer");
    const previewFrame = document.getElementById("previewFrame");
    const previewImage = document.getElementById("previewImage");

    // Helps with setting the modal back to being hidden after an action is taken (Confirm or Cancel or Clicking outside the modal)
    let modalCallback = null;

    // This function shows the modal and allows for customisation based off the given elements within the popup (Based on their type)
    function showModal({
        title = "Notice",
        message = "",
        type = "info", // Info, success, warning or danger options
        confirmText = "OK",
        showCancel = false,
        onConfirm = null,

        // These are for the memo popup
        showMemo = false,
        memoText = "",

        // These are for file previews
        showPreview = false,
        previewUrl = "",
        isImage = false
    })  {
        // Modal popup safety check (Modal popus no longer appearing fsr)
        if (!modal || !modalBox || !modalConfirm || !modalIcon) {
            console.error("Modal elements missing");
            return;
        }

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalConfirm.textContent = confirmText;

        // Removes the previous class types
        modalBox.classList.remove("info", "success", "warning", "danger");
        modalIcon.classList.remove("info", "success", "warning", "danger");
        modalConfirm.classList.remove("info", "success", "warning", "danger");

        // Adds the new class types based on the type parameter
        modalBox.classList.add(type);
        modalIcon.classList.add(type);
        modalConfirm.classList.add(type);

        // Toggle the cancel button
        modalCancel.style.display = showCancel ? "inline-block" : "none";

        // Memo display Handling 
        if (showMemo) {
            modalMessage.classList.add("hidden");

            memoInput.classList.remove("hidden");
            memoInput.value = memoText;
        } else {
            modalMessage.classList.remove("hidden");

            memoInput.classList.add("hidden");
            memoInput.value = "";
        }

        // Preview display handling
        if (showPreview) {

            previewFrame.src = "";
            previewImage.removeAttribute("src");

            previewImage.onload = () => console.log("Image loaded");
            previewImage.onerror = (e) => console.error("Image failed", e);

            previewFrame.onload = () => console.log("PDF iframe loaded");
            previewFrame.onerror = (e) => console.error("PDF iframe failed", e);

            previewContainer.classList.remove("hidden");

            // Test log remove later
            console.log("Image preview URL:", previewUrl);
            console.log("showPreview =", showPreview);
            console.log("isImage =", isImage);
            console.log("previewUrl =", previewUrl);

            // If found to be an image, only show the image section of the preview container and hide the URL preview
            if (isImage) {
                previewImage.src = previewUrl;
                previewImage.classList.remove("hidden");

                previewFrame.classList.add("hidden");

            } else {
                // If found to be a PDF, only show the url section of the preview container and hide the image preview
                previewImage.classList.add("hidden");
                previewImage.removeAttribute("src");

                previewFrame.classList.remove("hidden");
                previewFrame.src = previewUrl + "#toolbar=0";

                console.log("PDF URL:", previewFrame.src);
            } 
        } else {
            // Makes sure the preview container remains hidden if the preview is neither an image nor a pdf
            previewContainer.classList.add("hidden");

            previewFrame.src = "";
            previewImage.src = "";
        }

        modal.classList.remove("hidden");

        modalCallback = onConfirm;
    }

    // Confirm button event listener
    modalConfirm.addEventListener("click", function() {
        if (modalCallback) modalCallback();
        modal.classList.add("hidden");
        modalCallback = null;
    });

    // Cancel button event listener
    modalCancel.addEventListener("click", function() {
        modal.classList.add("hidden");
        modalCallback = null;
    });

    // Click outside the modal to close it
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
            modalCallback = null;
        }
    });



    //------------------ END OF FILE SECTION ----------------

    // -----------------AI Assistant section -------------------

    // Listens for the aiAssistant button to be clicked
    const aiAssistant = document.getElementById("aiAssistant");

    // Grab all elements relating to the ai assistant, and adds event listeners to them to make the ai assistant function properly
    if(aiAssistant) {
        const aibutton = aiAssistant.querySelector(".AIAssistanceBtn");
        const aiContent = aiAssistant.querySelector(".ai-content");
        const answerBox = aiAssistant.querySelector(".answer-box");
        const questions = aiAssistant.querySelectorAll(".question");

        // Opens the help menu
        aibutton.addEventListener("click", function(e) {
            e.stopPropagation();
            aiContent.classList.toggle("open");
        });

        // The custom answers for each question in the help menu
        const answers = {
            upload: "Click the 'Choose Files' button and select the files you wish to upload, then click the 'upload' button",

            favorite: "To favorite a folder, either click the folder icon or select 'favorite' in the dropdown menu. For Files click the heart button, or select the 'favorite' option from the dropdown menu",

            delete: "For folders, click the kebab menu and select delete. For files, either click the trash can icon or select 'delete' from the dropdown menu. You will be asked to confirm this action to prevent accidental deletions.",

            rename: "To rename a folder or file, either double click the name or open the kebab menu and select 'rename' from the context menu."

            // Ass more questions are asked add more data-answer s here!
        };

        //Event handler for the questions in the help menu
        questions.forEach(q => {
            q.addEventListener("click", function(e) {
                e.stopPropagation();

                const key = q.dataset.answer;

                answerBox.textContent = answers[key] || "Sorry, I don't have an answer for that question yet.";
            });
        });

        // To close the menu when clicking outside it
        document.addEventListener("click", function (e) {

            if (!aiAssistant.contains(e.target)) {
                aiContent.classList.remove("open");
            }
        });

    }

    // ------------------ END OF AI Assistant section -------------------

    // ----------------- Start of DB communication + checks area------------

    // Function to load all of the saved documents from Flask/MYSQL
    async function loadSavedDocuments() {

        try {

            // Calls the flask route
            const response = await fetch("/getDocuments");

            // Converts reposnse into JSON
            const documents = await response.json();

            // Test log remove later
            console.log(documents);

            // Test log remove later
            console.log("Documents response:", documents);

            // Clears existing document list
            listOfDocuments.replaceChildren();

            // If no documents exist, show the empty state
            if (documents.length === 0) {
                displayEmptyState();
                return;
            }

            // Adds each document to the page, splitting the is faved and those who are not, putting the favs first
            documents
                .sort((a, b) => b.is_favorite - a.is_favorite)
                .forEach(doc => {
                    addDocument(doc);
                });
        } catch (error) {
            console.error("Error loading documents:", error);

            showModal({
                title: "Loading Error",
                message: "Could not load saved documents",
                type: "warning"
            });
        }
    }


    // Function to Upload selected files to flask backend
    async function uploadFilesToServer() {

        // Gets the selected files from the file input
        const files = inputAFile.files;

        // Stops the upload if no files are selected
        if(files.length === 0) {
            showModal({
                title: "No Files Selected",
                message: "Please choose one or more files.",
                type: "warning"
            });

            return;
        }

        // Creates FormData object
        const formData = new FormData();

        // Adds each selected file
        for(let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        };

        try {
            // Sends files to flask
            const response = await fetch("/uploadFile", {
                method: "POST",
                body: formData
            });

            // Converts response to JSON
            const data = await response.json();

            // Upload Success
            if(data.success) {

                // Reload document list from DB
                await loadSavedDocuments();

                showModal({
                title: "Upload Complete",
                message: "Your files were successfuly uploaded.",
                type: "success"
                });

                // Clears selected files
                inputAFile.value = "";

                // Resets display text
                fileCountDisplay.textContent = "No files selected";

            } else {
                showModal({
                title: "Upload Failed",
                message: "The files could not be uploaded.",
                type: "warning"
                });
            } 
        
        } catch (error) {
            console.error("Upload Error", error);

            showModal({
                title: "Server Error",
                message: "Could not connect to the server.",
                type: "warning"
            });
        }
        
    }
 

   

 

    // ---------------- End of db section ------------------------




    // -------------- Test adding section ----------------

    // Test Add folders, uncomment to display them
    // ["Projects", "Invoices", "Reports", "Dancing Queen", "Dance Dance Revolution"].forEach(name => {
    //     folderList.appendChild(createFolder(name));
    // });

    // Test add files
    function addTestDocuments() {
        const testFiles = [
            "Report.pdf", "Budget.xlsx", "Presentation.pptx",
            "Notes.docx", "DesignMockup.pdf", "Invoice.xlsx",
            "Summary.docx", "DataAnalysis.xlsx", "Slides.pptx",
            "Contract.pdf", "MeetingMinutes.docx",
            "ProjectPlan.pdf", "FinancialReport.xlsx",
            "MarketingDeck.pptx", "ResearchPaper.pdf", "UserGuide.docx", "SalesData.xlsx", "Strategy.pptx",
            "Roadmap.pdf", "PerformanceReview.docx", "ExpenseReport.xlsx", "TeamPresentation.pptx",
            "ProductSpecs.pdf", "ClientProposal.docx", "AnnualReport.xlsx", "CompanyOverview.pptx",
        ];
        testFiles.forEach((file, index) => {
            addDocument({
                job_name: file,
                file_path: "",
                jid: index,
                docu_type: file.split(".").pop(),
                docu_size: 0,
                date_created: new Date().toISOString()
            });
        });
    }

    // Uncomment this line to fill the documents section with fake folders
    // addTestDocuments();

    // Adds a specific fake test document
    // addDocument("Test.pdf");

    // Comment this out when checking the add test documents bit above, makes sure 
    checkEmpty();

    // Loads saved documents when the page opens 
    loadSavedDocuments();

}); 