import TransmissionLineForm from '@/app/components/transmissionLine';

export default function EditDiagramPage({ params }) {
  return <TransmissionLineForm id={params.id} />;
}
