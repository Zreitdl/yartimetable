import AddOrUpdateTimetableRecordForm from "../components/AddOrUpdateTimetableRecordForm";
import Layout from "../components/Layout";

interface Props {}

const AddTimetableRecord = ({}: Props) => {
  return (
    <Layout>
      <AddOrUpdateTimetableRecordForm isEdit={false}/>
    </Layout>
  );
};

export default AddTimetableRecord;