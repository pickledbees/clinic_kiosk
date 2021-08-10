@ECHO off

set PRIVATE_KEY_PATH=./ssl/stg-demoapp-client-privatekey-2018.pem
set PUBLIC_CERT_PATH=./ssl/staging_myinfo_public_cert.cer

rem MyInfo variables
set MYINFO_APP_CLIENT_ID=STG2-MYINFO-SELF-TEST
set MYINFO_APP_CLIENT_SECRET=44d953c796cccebcec9bdc826852857ab412fbe2
set MYINFO_APP_REDIRECT_URL=https://clinicq.azurewebsites.net/callback
set MYINFO_API_AUTHORISE=https://test.api.myinfo.gov.sg/com/v3/authorise
set MYINFO_API_TOKEN=https://test.api.myinfo.gov.sg/com/v3/token
set MYINFO_API_PERSON=https://test.api.myinfo.gov.sg/com/v3/person
set MYINFO_ATTRIBUTES=uinfin,name,sex,race,nationality,dob,email,mobileno,regadd

rem SafeEntry variables
set SAFEENTRY_APP_CLIENT_ID=STG2-SEQR-SELF-TEST
set SAFEENTRY_APP_CLIENT_SECRET=
set SAFEENTRY_API=https://test.api.safeentry-qr.gov.sg/partner/v1/entry

set MONGODB_URL=mongodb+srv://clinicReader:clinicReaderPassword@cluster0.ckvfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
set MONGODB_COLLECTION=clinic_api
set MONGODB_DB=clinics

node app.js