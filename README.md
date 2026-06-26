## A Look into Parsing
<img width="308" height="209" alt="image" src="https://github.com/user-attachments/assets/f877eab5-ad92-4b30-83b6-63901f0e7ce2" /> <br>
Which then gets converted to this <br>
<img width="593" height="559" alt="image" src="https://github.com/user-attachments/assets/64585eba-aa9e-49dd-a24b-7e80b0b99beb" /> <br>

## How to Run DocuParse

DocuParse requires Python, Tesseract OCR, and several Python packages to run correctly.

### 1. Install Python Dependencies

Run this command inside the project folder:

```bash
pip install -r requirements.txt
```

Your `requirements.txt` file should include:

```text
flask
bcrypt
pytesseract
pillow
reportlab
opencv-python
numpy
pandas
mysql-connector-python
```

### 2. Install Tesseract OCR

DocuParse uses Tesseract OCR to extract text from uploaded documents.

Install Tesseract OCR using the official installation guide:

https://tesseract-ocr.github.io/tessdoc/Installation.html

After installing it, make sure Tesseract is added to your system PATH.

### 3. Run the Flask App

From the project folder, run:

```bash
python -m flask --app PythonBackend run
```

Copy the local link generated in the terminal and open it in your browser.

Example:

```text
http://127.0.0.1:5000
```

The first launch may take a few seconds.

---

## Database Setup

DocuParse can run without the database, but some features may not work fully, such as login and saved documents.

To use the full system, install MySQL Server/MySQL Workbench and create a database called:

```text
DocuParse
```

Then update the database connection details in `DBManager.py` using your own MySQL password.

Default database settings:

```text
Host: 127.0.0.1
Username: root
Port: 3306
Database: DocuParse
Password: your own MySQL password
```

Once the database is connected, run the Flask app again:

```bash
python -m flask --app PythonBackend run
```

---

## Demo Login

To test the login system, use:

```text
Username: test@email.com
Password: SleepingBabyLions
```

These login details will only work if the database has been set up correctly with the required user data.

---

## Notes

A demo video is available to show the full intended functionality.
AI-powered document restoration was planned as a future improvement, but the current version focuses mainly on document parsing and file management.
