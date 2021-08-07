const myInfo = {
  clientId: "",
  redirectUrl: "",
  authApiUrl: "",
  attributes: "",
  venueId: "",
};

$((_) => {
  getMyInfoEnv();

  if (window.location.href.includes("venueId")) {
    let urlParams = new URLSearchParams(window.location.search);
    myInfo.venueId = urlParams.get("venueId");
  }
});

if (
  window.location.href.includes("callback?") &&
  window.location.href.includes("code=")
) {
  let urlParams = new URLSearchParams(window.location.search);
  myInfo.venueId = urlParams.get("state");
  getMyInfoPersonData(urlParams.get("code"));
}

function getMyInfoEnv() {
  $.ajax({
    url: "/myInfoEnv",
    data: {},
    type: "GET",
    success: (data, _, xhr) => {
      myInfo.clientId = data.clientId;
      myInfo.redirectUrl = data.redirectUrl;
      myInfo.authApiUrl = data.authApiUrl;
      myInfo.attributes = data.attributes;
    },
    error: errorCallback,
  });
}

function redirectToAuthMyInfo() {
  const purpose = "prefill-form";
  const state = myInfo.venueId;
  window.location =
    myInfo.authApiUrl +
    "?client_id=" +
    myInfo.clientId +
    "&attributes=" +
    myInfo.attributes +
    "&purpose=" +
    purpose +
    "&state=" +
    encodeURIComponent(state) +
    "&redirect_uri=" +
    myInfo.redirectUrl;
}

function getMyInfoPersonData(authCode) {
  $.ajax({
    url: "/person",
    data: { authCode },
    type: "POST",
    success: (data) => {
      fillForm(data);
    },
    error: errorCallback,
  });
}

/**
 * Fills the form based on raw SingPass MyInfo Person API response body
 * form follows a standard person schema
 * @param personData
 */
function fillForm(personData) {
  $("#nric").val(personData.uinfin.value);
  $("#mobileno").val(personData.mobileno.nbr.value);
}

/**
 * Submit form data, enforces that mobile number and NRIC fields be filled
 * data sent includes the venueId on top of person schema
 * on success, performs redirect to queue page with necessary data in query params
 */
//TODO: perform validation, set loader, create failure to fetch alert
function submit() {
  let formData = {};
  $("#form")
    .serializeArray()
    .forEach(({ name, value }) => (formData[name] = value));
  $.ajax({
    url: "/submit",
    data: { ...formData, venueId: myInfo.venueId },
    type: "POST",
    success: (data) => {
      const { redirect, nric, mobileno, number, venueId } = data;
      window.location =
        redirect +
        "?nric=" +
        nric +
        "&mobileno=" +
        mobileno +
        "&number=" +
        number +
        "&venueId=" +
        venueId;
    },
    error: errorCallback,
  });
}

function errorCallback(xhr, status, error) {
  let err = JSON.parse(xhr.responseText);
  console.log(err.message);
}
