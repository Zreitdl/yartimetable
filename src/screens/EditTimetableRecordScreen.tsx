import { useParams } from "react-router-dom";
import AddOrUpdateTimetableRecordForm from "../components/AddOrUpdateTimetableRecordForm";
import Layout from "../components/Layout";

interface Props {}

const EditTimetableRecordScreen = ({}: Props) => {
  const id = useParams().id;

  return (
    <Layout>
      <AddOrUpdateTimetableRecordForm isEdit={true} editableTimetableRecordId={id}/>
    </Layout>
  );
};

export default EditTimetableRecordScreen;