const myInfo = {
  clientId: "",
  redirectUrl: "",
  authApiUrl: "",
  attributes: "",
  venueId: "",
};

$((_) => {
  window.onbeforeunload = () => true; //warn user when navigating away from page

  getMyInfoEnv();
  $("#indicator").hide();
  const urlParams = new URLSearchParams(window.location.search);

  if (window.location.href.includes("venueId")) {
    myInfo.venueId = urlParams.get("venueId");
  }

  if (window.location.href.includes("callback?")) {
    myInfo.venueId = urlParams.get("state");
    if (window.location.href.includes("code=")) {
      getMyInfoPersonData(urlParams.get("code"));
      $("#indicator").show();
    }
  }

  renderForm();
});

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
    error: () => {
      alert(
        "failed to load required data, please refresh the page or try again later"
      );
    },
  });
}

function redirectToAuthMyInfo() {
  window.onbeforeunload = undefined; //clear warning

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

//performs call to server to fetch MyInfo Person data
function getMyInfoPersonData(authCode) {
  $.ajax({
    url: "/person",
    data: { authCode },
    type: "POST",
    success: (data) => {
      $("#indicator").hide();
      fillForm(data);
    },
    error: () => {
      $("#indicator").hide();
      alert("failed to retrieve MyInfo data");
    },
  });
}

/**
 * Fills the form based on raw SingPass MyInfo Person API response body
 * form follows a standard person schema
 * @param data
 */
function fillForm(data) {
  //extract relevant fields
  let {
    uinfin: nric,
    name,
    mobileno,
    sex,
    race,
    nationality,
    dob,
    email,
    regadd,
  } = data;

  if (mobileno) {
    mobileno = str(mobileno.nbr);
  }

  if (regadd) {
    if (regadd.type === "SG") {
      const { country, block, building, floor, unit, street, postal } = regadd;
      regadd =
        str(country) === ""
          ? ""
          : str(block) +
            " " +
            str(building) +
            " \n" +
            "#" +
            str(floor) +
            "-" +
            str(unit) +
            " " +
            str(street) +
            " \n" +
            "Singapore " +
            str(postal);
    } else if (regadd.type === "Unformatted") {
      regadd = str(data.regadd.line1) + " \n" + str(data.regadd.line2);
    }
  }

  //fill form
  Object.entries({
    nric,
    name,
    mobileno,
    sex,
    race,
    nationality,
    dob,
    email,
    regadd,
  }).forEach(([key, value]) => {
    $(`#${key}`).val(str(value));
  });
}

/**
 * Submit form data, enforces that mobile number and NRIC fields be filled
 * data sent includes the venueId on top of person schema
 * on success, performs redirect to queue page with necessary data in query params
 */
function submit() {
  window.onbeforeunload = undefined; //clear warning

  if (!formIsValid()) {
    window.onbeforeunload = () => true;
    return;
  }

  let formData = {};

  $("#form")
    .serializeArray()
    .forEach(({ name, value }) => (formData[name] = value ? value : null));

  const ok = confirm("Submit form?");
  if (!ok) return;

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
    error: () => {
      window.onbeforeunload = () => true; //set warning back
      alert("failed to register, please try again");
    },
  });
}

//checks validity of form
function formIsValid() {
  //check if any empty
  const form = $("#form");
  let formData = form.serializeArray();
  for (let { name, value } of formData) {
    if (!value) {
      alert("All fields must be filled");
      return false;
    }
  }

  //check validity of nric
  const nric = form.find("input[name='nric']").val();
  if (/^[STFG]d{7}[A-Z]$/.test(nric) || /^[a-zA-Z0-9-]{3,20}$/.test(nric)) {
    return true;
  } else {
    alert("invalid NRIC");
    return false;
  }

  //TODO: check validity of number
}

function renderForm() {
  const form = $("#form");
  [
    labelInputPair("NRIC", "nric"),
    labelInputPair("Full Name", "name"),
    labelInputPair("Phone Number", "mobileno"),
    labelInputPair("Sex", "sex"),
    labelInputPair("Race", "race"),
    labelInputPair("Nationality", "nationality"),
    labelInputPair("Date of Birth", "dob"),
    labelInputPair("Email", "email"),
    labelInputPair("Address", "regadd"),
  ].forEach((fragment) => form.append(fragment));
}

function labelInputPair(labelText, name) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  label.innerText = labelText;
  label.setAttribute("for", name);
  input.type = "text";
  input.id = name;
  input.name = name;
  input.classList.add("form-control");
  div.appendChild(label);
  div.appendChild(input);
  div.classList.add("form-group");
  return div;
}

//function to extract value / description from MyInfo Person API response
function str(data) {
  if (!data) return null;
  if (data.value) return data.value;
  if (data.desc) return data.desc;
  if (typeof data === "string") return data;
  return "";
}
