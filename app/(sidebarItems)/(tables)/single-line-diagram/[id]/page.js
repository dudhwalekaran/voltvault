import EditSingleLineDiagram from '@/app/components/singleLineDiagram';

export default function EditDiagramPage({ params }) {
  return <EditSingleLineDiagram id={params.id} />;
}
