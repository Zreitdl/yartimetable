import { useEffect } from "react";
import Layout from "../components/Layout";
import TimetableWithControls from "../components/TimetableWithControls/TimetableWithControls";

interface Props {}

const Home = ({}: Props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <TimetableWithControls />
    </Layout>
  );
};

export default Home;
