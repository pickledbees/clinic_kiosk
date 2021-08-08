const urlParams = new URLSearchParams(window.location.search);
const pageData = {
  nric: urlParams.get("nric"),
  mobileno: urlParams.get("mobileno"),
  number: urlParams.get("number"),
  venueId: urlParams.get("venueId"),
};

$("#queue_number").text(pageData.number);

//connect to socket to receive calling notifications
const socket = io();
socket.on("number called", (data) => {
  console.log(data);
  if (data.number == pageData.number && data.venueId === pageData.venueId) {
    console.log("you're up"); //TODO: show proper alert
  }
});

function checkIn() {
  callSafeEntry("checkin");
}

function checkOut() {
  callSafeEntry("checkout");
}

//TODO: show checkin / checkout success/failure
function callSafeEntry(action) {
  $.ajax({
    url: "/safeEntry",
    data: {
      subType: "uinfin",
      actionType: action,
      sub: pageData.nric,
      venueId: pageData.venueId,
      mobileno: pageData.mobileno,
    },
    type: "POST",
    success: () => console.log(action, "success"),
    error: () => console.log(action, "failed"),
  });
}
