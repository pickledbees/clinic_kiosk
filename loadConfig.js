//NOTE: this is only for dev purposes
//for deployment, please init variables with a script

const config = {
  PRIVATE_KEY_PATH: "./ssl/stg-demoapp-client-privatekey-2018.pem",
  PUBLIC_CERT_PATH: "./ssl/staging_myinfo_public_cert.cer",

  MYINFO_APP_CLIENT_ID: "STG2-MYINFO-SELF-TEST",
  MYINFO_APP_CLIENT_SECRET: "44d953c796cccebcec9bdc826852857ab412fbe2",
  MYINFO_APP_REDIRECT_URL: "http://localhost:3001/callback",
  MYINFO_API_AUTHORISE: "https://test.api.myinfo.gov.sg/com/v3/authorise",
  MYINFO_API_TOKEN: "https://test.api.myinfo.gov.sg/com/v3/token",
  MYINFO_API_PERSON: "https://test.api.myinfo.gov.sg/com/v3/person",
  MYINFO_ATTRIBUTES:
    "uinfin,name,sex,race,nationality,dob,email,mobileno,regadd",

  SAFEENTRY_APP_CLIENT_ID: "STG2-SEQR-SELF-TEST",
  SAFEENTRY_APP_CLIENT_SECRET: "",
  SAFEENTRY_API: "https://test.api.safeentry-qr.gov.sg/partner/v1/entry",

  MONGODB_URL:
    "mongodb+srv://clinicReader:clinicReaderPassword@cluster0.ckvfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
};

for (let variable in config) {
  process.env[variable] = config[variable];
}
