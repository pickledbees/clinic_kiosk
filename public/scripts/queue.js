const urlParams = new URLSearchParams(window.location.search);
const pageData = {
  nric: urlParams.get("nric"),
  mobileno: urlParams.get("mobileno"),
  number: urlParams.get("number"),
  venueId: urlParams.get("venueId"),
};

$(() => {
  $("#indicator").hide();
  checkIn();
});

//connect to socket to receive calling notifications
const socket = io();

//set up socket listener
socket.on("number called", (data) => {
  console.log(data);
  if (data.number == pageData.number && data.venueId === pageData.venueId) {
    showCalled();
  }
});

$.ajax({
  url: `/checkNumber/${pageData.venueId}/${pageData.number}`,
  type: "GET",
  success: (data) => {
    if (data.called) showCalled();
  },
});

function checkIn() {
  callSafeEntry("checkin");
}

function checkOut() {
  callSafeEntry("checkout");
}

function callSafeEntry(action) {
  //show check in / out visual
  const direction = action === "checkin" ? "in" : "out";
  const indicator = $("#indicator");
  const safeEntryText = $("#safeentry_text");
  indicator.show();
  safeEntryText.text(`Checking you ${direction} with SafeEntry...`);

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
    success: () => {
      indicator.hide();
      safeEntryText.text(`Successfully checked ${direction} with SafeEntry.`);
      if (direction === "out") {
        //disable buttons
        $("#check_in").hide();
        $("#check_out").hide();
        //TODO: maybe send a new page instead?
      }
    },
    error: () => {
      indicator.hide();
      safeEntryText.text(
        `Failed to check ${direction} with SafeEntry, please try again.`
      );
    },
  });
}

function showCalled() {
  const alertBox = $("#alert_box");
  alertBox.text("Your Queue number has been called");
  alertBox.addClass("ok");
}
