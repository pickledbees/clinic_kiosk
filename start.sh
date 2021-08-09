export PRIVATE_KEY_PATH=./ssl/stg-demoapp-client-privatekey-2018.pem
export PUBLIC_CERT_PATH=./ssl/staging_myinfo_public_cert.cer

# MyInfo variables
export MYINFO_APP_CLIENT_ID=STG2-MYINFO-SELF-TEST
export MYINFO_APP_CLIENT_SECRET=44d953c796cccebcec9bdc826852857ab412fbe2
export MYINFO_APP_REDIRECT_URL=https://clinicq.azurewebsites.net/callback
export MYINFO_API_AUTHORISE=https://test.api.myinfo.gov.sg/com/v3/authorise
export MYINFO_API_TOKEN=https://test.api.myinfo.gov.sg/com/v3/token
export MYINFO_API_PERSON=https://test.api.myinfo.gov.sg/com/v3/person
export MYINFO_ATTRIBUTES=uinfin,name,sex,race,nationality,dob,email,mobileno,regadd

# SafeEntry variables
export SAFEENTRY_APP_CLIENT_ID=STG2-SEQR-SELF-TEST
export SAFEENTRY_APP_CLIENT_SECRET=
export SAFEENTRY_API=https://test.api.safeentry-qr.gov.sg/partner/v1/entry

export MONGODB_URL=mongodb+srv://clinicReader:clinicReaderPassword@cluster0.ckvfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
export MONGODB_COLLECTION=clinic_api

node app.js