import ShuntEditForm from "@/app/components/shuntForm";

export default function EditShuntPage({ params }) {
  console.log("EditShuntPage params:", params); // Debugging log
  return <ShuntEditForm id={params.id} />;
}
