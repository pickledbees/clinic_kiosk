function Patient(
  name,
  nric,
  sex,
  race,
  nationality,
  dob,
  email,
  mobileno,
  regadd,
  appointment,
  issue
) {
  this.name = name;
  this.nric = nric;
  this.sex = sex;
  this.race = race;
  this.nationality = nationality;
  this.dob = dob;
  this.email = email;
  this.mobileno = mobileno;
  this.regadd = regadd;
  this.appointment = appointment;
  this.issue = issue;
}

module.exports = Patient;
