// models/Bus.js
import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  series: { type: String, required: true },
});

const Series = mongoose.models.Series || mongoose.model('SeriesFact', SeriesSchema);

export default Series;
