/*Put these here to drop the tables if they've been created. This helped debug a lot of problems when making the database initially*/
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS document_details;
DROP TABLE IF EXISTS parsed_jobs;
DROP TABLE IF EXISTS user_details;


/*Holds a majority of the users details which are used to handle their account.*/
CREATE TABLE user_details (
    uid INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(100),
    salt VARCHAR(36) NOT NULL,
    DOB DATE NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    address VARCHAR(100),
    zip VARCHAR(7),
    country TEXT
);

/*Table that identifies if an account has admin rights*/
CREATE TABLE account (
    uid INT PRIMARY KEY,
    admin_rights BOOLEAN,
    FOREIGN KEY(uid) REFERENCES user_details(uid)
);

/*Table was going to be used for an extra feature that tells the user how many documents they've parsed over the 
life of their account and how many documents they have stored on our website*/
/*This was an extra feature that we didn't have the time to add, however it was a cosmetic change*/
CREATE TABLE parsed_jobs (
    jid INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    jobs_submitted INT,
    documents_held INT
);

/*Entity created for the saved documents page. Saves documents as individual entities on their own.*/
CREATE TABLE document_details (
    jid INT AUTO_INCREMENT PRIMARY KEY,
    job_name TEXT NOT NULL,
    date_created DATE NOT NULL,
    file_path TEXT NOT NULL,
    docu_type VARCHAR(20) NOT NULL,
    docu_size INT NOT NULL, 
    ai_restored BOOLEAN NOT NULL,
    docu_memo TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE
);

/*Dummy prompt to test that the user can log in. Encrypting the plaintext password and adding salt to it to try and prevent rainbow table attacks*/
INSERT INTO user_details(uid, first_name, last_name, email, password, salt,  DOB, phone_no, address, zip, country)
SELECT '0001', 'Lemon', 'Gravinson', 'test@email.com',
    SHA2(CONCAT('SleepingBabyLions', salt_val), 256),
    salt_val,
    '1998-02-23', '01332 676767', '13 Zestethalon road, adesville', 'AV3 7ZS', 'Lemonada'
FROM (SELECT UUID() AS salt_val) AS tmp;

INSERT INTO user_details(uid, first_name, last_name, email, password, DOB, phone_no, address, zip, country)
VALUES
('0001', 'Lemon', 'Gravinson', 'test@email.com', 'SleepingBabyLions', '1998-02-23', '01332 676767', '13 Zestethalon road, adesville', 'AV3 7ZS', 'Lemonada');

