const mongoose = require('mongoose');
const { Schema, model, models } = mongoose;

const transformersThreeWindingSchema = new Schema({
  location: { type: String },
  circuitBreakerStatus: { type: String },
  busprimaryFrom: { type: String },
  busprimarySectionFrom: { type: String },
  bussecondaryTo: { type: String },
  busSectionSecondaryTo: { type: String },
  bustertiaryTo: { type: String },
  busSectionTertiaryTo: { type: String },
  mva: { type: String },
  kvprimaryVoltage: { type: String },
  kvsecondaryVoltage: { type: String },
  kvtertiaryVoltage: { type: String },
  psprimarysecondaryR: { type: String },
  psprimarysecondaryX: { type: String },
  ptprimarytertiaryR: { type: String },
  ptprimarytertiaryX: { type: String },
  stsecondarytertiaryR: { type: String },
  stsecondarytertiaryX: { type: String },
  TapPrimary: { type: String },
  TapSecondary: { type: String },
  TapTertiary: { type: String },
  primaryConnection: { type: String },
  primaryConnectionGrounding: { type: String },
  secondaryConnection: { type: String },
  secondaryConnectionGrounding: { type: String },
  tertiaryConnection: { type: String },
  tertiaryConnectionGrounding: { type: String },
});

const TransformersThreeWinding = models.TransformersThreeWinding || model("TransformersThreeWinding", transformersThreeWindingSchema);

module.exports = TransformersThreeWinding;
