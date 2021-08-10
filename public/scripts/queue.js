const urlParams = new URLSearchParams(window.location.search);
const pageData = {
  nric: urlParams.get("nric"),
  mobileno: urlParams.get("mobileno"),
  number: urlParams.get("number"),
  venueId: urlParams.get("venueId"),
  status: 0,
  lastCalled: [],
};

$(() => {
  $("#indicator").hide();
  checkIn();
});

//connect to socket to receive calling notifications
const socket = io();

socket.emit("register socket", { venueId: pageData.venueId });

//set up socket listener
socket.on("number called", (data) => {
  if (data.number == pageData.number) pageData.status = 1;
  pageData.lastCalled = data.lastCalled;
  render();
});

//check status on page load
$.ajax({
  url: `/checkStatus/${pageData.venueId}/${pageData.nric}/${pageData.number}`,
  type: "GET",
  success: (data) => {
    pageData.status = data.status;
    pageData.lastCalled = data.lastCalled;
    render();
  },
  error: () => {
    pageData.status = 3;
    render();
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

  hideButtons();

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
      showButtons();
      safeEntryText.text(`Successfully checked ${direction} with SafeEntry.`);
    },
    error: () => {
      indicator.hide();
      showButtons();
      safeEntryText.text(
        `Failed to check ${direction} with SafeEntry, please try again.`
      );
    },
  });
}

function hideButtons() {
  const checkinButton = $("#check_in");
  const checkoutButton = $("#check_out");
  checkinButton.hide();
  checkoutButton.hide();
}

function showButtons() {
  const checkinButton = $("#check_in");
  const checkoutButton = $("#check_out");
  checkinButton.show();
  checkoutButton.show();
}

function render() {
  const alertBox = $("#alert_box");
  const lastCalledBox = $("#lastcalled_box");

  //render last called box
  lastCalledBox.empty();
  pageData.lastCalled.forEach(({ number, time }) => {
    const div = document.createElement("div");
    div.innerText = `Number ${number} called at ${new Date(
      time
    ).toLocaleTimeString()}`;
    lastCalledBox.append(div);
  });

  //render status
  let statusText = {
    0: "You will be notified on this page when your queue number is called",
    1: "Your queue number has been called",
    2: "This page is old, please re-register to get a new queue number",
    3: "ERROR: Could not connect, please refresh page and try again",
  }[pageData.status];
  alertBox.text(statusText);

  if (pageData.status === 1) alertBox.addClass("ok");
}
