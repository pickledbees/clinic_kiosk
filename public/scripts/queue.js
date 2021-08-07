const urlParams = new URLSearchParams(window.location.search);
const pageData = {
  nric: urlParams.get("nric"),
  mobileno: urlParams.get("mobileno"),
  number: urlParams.get("number"),
  venueId: urlParams.get("venueId"),
};

$("#queue_number").text(pageData.number);

const socket = io();
socket.on("callNumber", (data) => {
  console.log(data);
  if (data.number == pageData.number && data.venueId === pageData.venueId) {
    console.log("you're up");
  }
});

function checkIn() {
  callSafeEntry("checkin");
}

function checkOut() {
  callSafeEntry("checkout");
}

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
    success: () => console.log("yay"),
    error: () => console.log("ohno"),
  });
}
