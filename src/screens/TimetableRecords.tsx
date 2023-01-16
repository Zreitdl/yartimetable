import { useEffect } from "react";
import Layout from "../components/Layout";
import TimetableRecordsList from "../components/TimetableRecordsList";

interface Props {}

const TimetableRecords = ({}: Props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <TimetableRecordsList />
    </Layout>
  );
};

export default TimetableRecords;
