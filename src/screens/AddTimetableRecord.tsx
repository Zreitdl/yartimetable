import { useEffect } from "react";
import AddTimetableRecordForm from "../components/AddTimetableRecordForm";
import Layout from "../components/Layout";

interface Props {}

const AddTimetableRecord = ({}: Props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = () => {};

  return (
    <Layout>
      <AddTimetableRecordForm onSubmit={onSubmit}/>
    </Layout>
  );
};

export default AddTimetableRecord;