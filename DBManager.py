
#importing pandas so we can manage information
import pandas as pd
from pandas import DataFrame
import mysql.connector as conct
import bcrypt

from flask import Flask

# Taken from PythonBackend.py written by ls860
# To run the Flask application, use the following command in your terminal:
# python -m flask --app PythonBackend run
app = Flask(__name__)

#Database setup connection
#This connection is mine(js2377) for the time being we're running this locally off of my machine
#Basic setup so the Manager can connect and grab info from the database

#commented out so Markers can still use the flask environment without having to connect to the database.
def getConn():
    return conct.connect(
        database = 'docuparse', 
        host = "127.0.0.1",
        user = "root",
        password = "K@thmandu1",
        port = "3306"
)
    
conn = getConn()

#basics for query management and table merging
#Test prompt to see if it will print anything from this table (this is how we will know it was connected)
#sqlTest = "SELECT * FROM user_details" 
#creating a datafile frm this so we can see what the tables look like.
#test = pd.read_sql(sqlTest, conn)
#print(test)

#Table created for the saved documents page. Necessary details are in this table
#Will have to acceptance test this as it takes a file as an input so it'll have 
#to be involved in the manual testing of the web app
def savedDocuments():
    sql1 = "SELECT us.uid, us.first_name, us.last_name, dc.docu_data " \
    "FROM user_details AS us" \
    " RIGHT JOIN document_details AS dc " \
    "ON us.uid = dc.jid"


#Insert code to check the database for existing passwords and account detail checks. Will do this later
def loginDetails(email, password):
    # login table SQL (user details pretty much and just a test to see if the table merged with all the relevant information)
    sql2 = "SELECT us.uid, us.first_name, us.last_name, email, us.password" \
    " FROM user_details AS us"
    loginPage = pd.read_sql(sql2, conn)
    print(loginPage)
    connect = getConn()
    cursor = connect.cursor(dictionary=True)

    cursor.execute("SELECT * FROM user_details WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    connect.close()

    if not user:
        return False
    
    print(f"DB password: '{user['password']}'")
    print(f"Entered Password: '{password}'")

    return user["password"] == password





# Save Function for saving documents 
def saveDocument(file_name, file_path, file_type, file_size):

    connect = getConn()
    cursor = connect.cursor()

    sql = """
    INSERT INTO document_details
    (job_name, date_created, file_path, docu_type, docu_size, ai_restored)
    VALUES (%s, CURDATE(), %s,%s, %s, %s)
    """

    values = (
        file_name,
        file_path,
        file_type,
        file_size,
        False
    )

    cursor.execute(sql, values)

    connect.commit()

    cursor.close()
    connect.close()


# Function to GET the documents 
def getDocuments():
    connect = getConn()
    cursor = connect.cursor(dictionary=True)

    cursor.execute("""
                   SELECT 
                        jid,
                        job_name,
                        file_path,
                        docu_type,
                        docu_size,
                        date_created,
                        is_favorite
                   FROM document_details
                   """)
    
    documents = cursor.fetchall()

    cursor.close()
    connect.close()

    return documents
