import Layout from "../components/Layout";
import TimetableSettingsForm from "../components/TimetableSettingsForm";

interface Props {}

const TimetableSettingsScreen = ({}: Props) => {
  return (
    <Layout>
      <TimetableSettingsForm />
    </Layout>
  );
};

export default TimetableSettingsScreen;