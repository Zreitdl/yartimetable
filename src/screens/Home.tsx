import { useEffect } from "react";
import Layout from "../components/Layout";

interface Props {}

const Home = ({}: Props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <img alt="timetable" src="images/anjumanya.jpeg"></img>
    </Layout>
  );
};

export default Home;
