/**
 * Represents a model of the current patients still awaiting their turn
 * broadcasting to subscribed sockets changes to the model
 */
class PatientsModel {
  constructor(io) {
    this._nricToPatient = {};
    this._numberToPatient = {};
    this._number = 0;
    this._io = io;
  }

  callNumber(number) {
    if (number in this._numberToPatient) {
      this._io.emit("number called", { number });
      delete this._nricToPatient[this._numberToPatient[number].nric];
      delete this._numberToPatient[number];
    }
  }

  addPatient(patientData) {
    //to maintain idempotency and remove potential duplicates
    if (patientData.nric in this._nricToPatient) {
      return this._nricToPatient[patientData.nric].number;
    }

    this._number++;
    const patient = { number: this._number, ...patientData };

    this._numberToPatient[this._number] = patient;
    this._nricToPatient[patientData.nric] = patient;

    this._io.emit("patient added", { patient });
    return this._number;
  }

  getPatients() {
    return Object.values(this._numberToPatient);
  }
}

module.exports = PatientsModel;
