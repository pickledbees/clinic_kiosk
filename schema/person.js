module.exports = {
  type: "object",
  properties: {
    name: { type: "string" },
    nric: { type: "string" },
    sex: { type: "string" },
    race: { type: "string" },
    nationality: { type: "string" },
    dob: { type: "string" },
    email: { type: "string" },
    mobileno: { type: "string" },
    regadd: { type: "string" },
  },
  required: [
    "name",
    "nric",
    "sex",
    "race",
    "nationality",
    "dob",
    "email",
    "mobileno",
  ],
};
