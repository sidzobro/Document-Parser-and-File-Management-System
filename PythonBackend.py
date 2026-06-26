from flask import Flask, render_template, request, jsonify
import bcrypt
import pytesseract
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from flask import Flask, render_template, request, send_file
import cv2
import numpy as np
import os
import tempfile
import mimetypes
import DBManager

# Import for saved Documents
import os 
from werkzeug.utils import secure_filename
from flask import send_from_directory

# TRIPPLE CHECK THIS ONE AS THIS MAY CAUSE ISSUES WITH RUNNING FLASK
# from DBManager import loginDetails, saveDocument, getDocuments, getConn


# To run the Flask application, use the following command in your terminal:
#python -m flask --app PythonBackend run
app = Flask(__name__)

#immporting CORS so the port from the database being requested doesn't get blocked by the browser
from flask_cors import CORS
#importing the Database Manager then calling the user login funtion
#from DBManager import loginDetails 

CORS(app)

@app.route("/")
def home():
    return render_template("login.html")

@app.route("/sid")
def sid():
    return render_template("sid_html.html")

@app.route("/accounts")
def accounts():
    return render_template("account.html")

@app.route("/savedDocumentsPage")
def savedDoc():
    return render_template("savedDocumentsPage.html")

#added the POST call here because the return statement originally in this part of the code was unreachable
@app.route("/login", methods=["PUT"])
def login():
    #gets the input from the login boxes and matches the details with whats already in the database.
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        if DBManager.loginDetails(email, password):
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    #Helpful debugging if statement that helped me understand why previous login attempts didn't work
    except Exception as e:
        app.logger.exception("Login failed")
        return jsonify({'error': str(e)}), 500


@app.route("/settings")
def settings():
    return render_template("settings.html")

@app.route("/language")
def language():
    return render_template("language.html")

@app.route("/upload")
def upload():
    return render_template("UploadPage.html")

@app.route("/reviews")
def reviews():
    return render_template("reviews.html")

# (Casey messed with this 12/05.2026) Changed the path from mainmenu to menu as mainmenu is bare as of writing with main being the fully functional main menu
@app.route("/mainmenu")
def mainmenu():
    return render_template("main.html")


@app.route("/parse", methods = ["POST"])
def parse():

    f = request.files['file']
    f.save(f.filename)

    text = request.form["text"]
    img = cv2.imread(f.filename)

    #UPSCALING

    ##img = cv2.resize(
        #img,
        #None,
        #fx=4,
        #fy=4,
        #interpolation=cv2.INTER_CUBIC
    #)

    ## Commented out after initially trying to insert more pipeline for a better parsing for maxed blurred out projects.

    thresh = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
    sharpen_kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    sharpen = cv2.filter2D(thresh, -1, sharpen_kernel)

    tes = pytesseract.image_to_string(sharpen)

    #cv2.imshow('sharpen', sharpen)
    #cv2.waitKey()

    fileName = (text + ".pdf")
    documentTitle = "testOutputTitle"
    title = "Your Parsed Output"
    textLines = tes.splitlines()

    #desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    #filePath = os.path.join(desktop, fileName)
    filePath = os.path.join(tempfile.gettempdir(), fileName)

    pdf = canvas.Canvas(filePath)
    pdf.setTitle(documentTitle)

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawCentredString(300, 770, title)

    #an actual line at the top of the page
    pdf.line(30, 710, 550, 710)

    text = pdf.beginText(5, 680)
    text.setFont("Courier", 12)
    text.setFillColor(colors.black)

    for line in textLines:
        text.textLine(line)

    pdf.drawText(text)

    pdf.save()

    #from flask import send_file

    os.remove(f.filename)
    
    return send_file(
    filePath,
    mimetype='application/pdf',
    as_attachment=True,
    download_name=fileName
)

# Saved documents page functions


# Saved Documents Upload Route
UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route to grab the files from the uploads folder
@app.route("/uploadFile", methods=["POST"])
def uploadFile():

    if "files" not in request.files:
        return jsonify({"success": False})
    
    uploaded_files = request.files.getlist("files")

    saved_files = []

    for file in uploaded_files:

        if file.filename == "":
            continue
 
        filename = secure_filename(file.filename)

        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        file.save(save_path)

        DBManager.saveDocument(
            filename,
            save_path,
            filename.split(".")[-1],
            os.path.getsize(save_path)
        )

        saved_files.append(filename)

    return jsonify({
        "success": True,
        "files": saved_files
    })

# Function to grab the documents 
@app.route("/getDocuments")
def get_documents():

    documents = DBManager.getDocuments()

    return jsonify(documents)

# Function to make favoriting a document persistant
@app.route("/favoriteDocument/<int:file_id>", methods=["POST"])
def favoriteDocument(file_id):

    data = request.get_json()

    is_favorite = data["favorite"]

    connect = DBManager.getConn()
    cursor = connect.cursor()

    cursor.execute("""
                    UPDATE document_details
                   SET is_favorite = %s
                   WHERE jid = %s
                   """, (is_favorite, file_id))
    
    connect.commit()

    cursor.close()
    connect.close()

    return jsonify({"success": True})

# Function to delete items
@app.route("/deleteDocument/<int:jid>", methods=["DELETE"])
def deleteDocument(jid):

    connection = DBManager.getConn()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT file_path FROM document_details WHERE jid = %s",
        (jid,)
    )

    document = cursor.fetchone()

    if not document:
        return jsonify({"success": False})
    
    file_path = document["file_path"]

    # Delete the physical file
    if os.path.exists(file_path):
        os.remove(file_path)

    # Delete DB record
    cursor.execute(
        "DELETE FROM document_details WHERE jid = %s",
        (jid,)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"success": True})

# Function to rename files perminantly
@app.route("/renameDocument/<int:file_id>", methods=["PUT"])
def rename_document(file_id):

    data = request.get_json()

    new_name = data.get("new_name")

    if not new_name:
        return jsonify({
            "success": False,
            "message": "No new filename provided."
        }), 400

    try: 
        connection = DBManager.getConn()
        cursor = connection.cursor(dictionary=True)
        # Get existing file infomation
        cursor.execute(""" 
                       SELECT job_name, file_path
                       FROM document_details
                       WHERE jid = %s
                       """, (file_id,))
        
        file_record = cursor.fetchone()

        if not file_record:
            return jsonify({
            "success": False,
            "message": "No new filename provided."
        }), 404

        old_name = file_record["job_name"]
        old_path = file_record["file_path"]

        # Create a new path
        folder = os.path.dirname(old_path)
        new_path = os.path.join(folder, new_name)

        # Rename the physcial file
        os.rename(old_path, new_path)

        # Update the db
        cursor.execute(""" 
                       UPDATE document_details
                       SET job_name = %s,
                       file_path = %s
                       WHERE jid = %s
                       """, (new_name, new_path, file_id))
        
        connection.commit()

        cursor.close()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("Rename Error:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# Function to grab the exising memo
@app.route("/getMemo/<int:file_id>", methods=["GET"])
def get_memo(file_id):

    conn = DBManager.getConn()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT docu_memo FROM document_details WHERE jid = %s",
        (file_id,)
    )

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({
        "memo" : result["docu_memo"] if result else ""
    })

# Function to save the memo
@app.route("/saveMemo/<int:file_id>", methods=["POST"])
def save_memo(file_id):

    data = request.get_json()

    memo = data.get("memo", "")

    conn = DBManager.getConn()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE document_details SET docu_memo = %s WHERE jid = %s",
        (memo, file_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success" : True
    })

# Function to download a file
@app.route("/downloadDocument/<int:file_id>", methods=["GET"])
def download_document(file_id):

    connection = DBManager.getConn()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
                    SELECT job_name, file_path
                   FROM document_details
                   WHERE jid = %s
                   """, (file_id,))
    
    document = cursor.fetchone()

    cursor.close()
    connection.close()

    if not document:
        return jsonify({
            "success": False,
            "message": "Document not found"
        }), 404
    
    file_path = document["file_path"]

    if not os.path.exists(file_path):
        return jsonify({
            "success": False,
            "message": "File does not exist on server"
        }), 404
    
    return send_file(
        file_path,
        as_attachment=True,
        download_name=document["job_name"]
    )

# Function to allow for previews of files (Will only work for PDF's or Images, will need to display a popup modal for all other files)
@app.route("/previewDocument/<int:file_id>")
def preview_document(file_id):

    connection = DBManager.getConn()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
                   SELECT job_name, file_path
                   FROM document_details
                   WHERE jid = %s
                   """,(file_id,))
    
    document = cursor.fetchone()

    cursor.close()
    connection.close()

    if not document:
        return jsonify({
            "success" : False,
            "message": "Document not found"
        }), 404
    
    file_path = document["file_path"]

    if not os.path.exists(file_path):
        return jsonify({
            "success": False,
            "message" : "File does not exist"
        }), 404
    

    mime_type, _ = mimetypes.guess_type(file_path)

    print("Preview file:", file_path)
    print("Mime type:", mime_type)

    print("Preview request:")
    print("Path:", file_path)
    print("Exists:", os.path.exists(file_path))

    return send_file(file_path)

# , mimetype=mime_type, as_attachment=False



if __name__ == "__main__":
    app.run(debug=True, port=5000)