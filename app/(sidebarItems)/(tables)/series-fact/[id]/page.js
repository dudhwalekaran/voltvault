import SeriesForm from "@/app/components/seriesForm";

export default function EditSeriesPage({ params }) {
  return <SeriesForm id={params.id} />;
}
