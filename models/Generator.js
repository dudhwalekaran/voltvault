const mongoose = require('mongoose');

const generatorSchema = new mongoose.Schema(
  {
    location: {
      type: String,
    },
    circuitBreakerStatus: {
      type: String,
    },
    busTo: {
      type: String,
    },
    busSectionTo: {
      type: String,
    },
    type: {
      type: String,
    },
    rotor: {
      type: String,
    },
    mw: {
      type: String,
    },
    mva: {
      type: String,
    },
    kv: {
      type: String,
    },
    synchronousReactancePuXd: {
      type: String,
    },
    synchronousReactancePuXq: {
      type: String,
    },
    transientReactancePuXdPrime: {
      type: String,
    },
    transientReactancePuXqPrime: {
      type: String,
    },
    subtransientReactancePuXdPrimePrime: {
      type: String,
    },
    subtransientReactancePuXqPrimePrime: {
      type: String,
    },
    transientOCTimeConstantSecondsTd0Prime: {
      type: String,
    },
    transientOCTimeConstantSecondsTq0Prime: {
      type: String,
    },
    subtransientOCTimeConstantSecondsTd0PrimePrime: {
      type: String,
    },
    subtransientOCTimeConstantSecondsTq0PrimePrime: {
      type: String,
    },
    statorLeakageInductancePuXl: {
      type: String,
    },
    statorResistancePuRa: {
      type: String,
    },
    inertiaMJMVAH: {
      type: String,
    },
    poles: {
      type: String,
    },
    speed: {
      type: String,
    },
    frequency: {
      type: String,
    },
  },
);

const Generator = mongoose.models.Generator || mongoose.model('Generator', generatorSchema);

module.exports = Generator;
