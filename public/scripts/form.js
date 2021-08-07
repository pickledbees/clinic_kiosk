const myInfo = {
  clientId: "",
  redirectUrl: "",
  authApiUrl: "",
  attributes: "",
  venueId: "",
};

$((_) => {
  getMyInfoEnv();

  if (window.location.href.includes("venue_id")) {
    let urlParams = new URLSearchParams(window.location.search);
    myInfo.venueId = urlParams.get("venue_id");
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
    success: (data, status, xhr) => {
      console.log(data);
      fillForm(data);
    },
    error: errorCallback,
  });
}

function fillForm(personData) {
  $("#nric").val(personData.uinfin.value);
  $("#mobileno").val(personData.mobileno.nbr.value);
}

function submit() {
  let formData = {};
  $("#form")
    .serializeArray()
    .forEach(({ name, value }) => (formData[name] = value));
  $.ajax({
    url: "/submit",
    data: formData,
    type: "POST",
    success: (data, status, xhr) => {
      window.location = data.redirect;
    },
    error: errorCallback,
  });
}

function errorCallback(xhr, status, error) {
  let err = JSON.parse(xhr.responseText);
  console.log(err.message);
}
