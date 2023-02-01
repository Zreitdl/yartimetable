import TimetableRecords from "../screens/TimetableRecords";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import AddTimetableRecord from "../screens/AddTimetableRecord";
import EditTimetableRecordScreen from "../screens/EditTimetableRecordScreen";
import TimetableSettingsScreen from "../screens/TimetableSettingsScreen";

interface RouteType {
  path: string;
  component: any;
  name: string;
  protected: boolean;
}

const routes: RouteType[] = [
  {
    path: "",
    component: Dashboard,
    name: "Dashboard Screen",
    protected: true,
  },
  {
    path: "/list",
    component: TimetableRecords,
    name: "Timetable records list Screen",
    protected: true,
  },
  {
    path: "/add",
    component: AddTimetableRecord,
    name: "Add timetable record screen",
    protected: true,
  },
  {
    path: "/edit/:id",
    component: EditTimetableRecordScreen,
    name: "Edit timetable record screen",
    protected: true,
  },
  {
    path: "/settings",
    component: TimetableSettingsScreen,
    name: "Timetable settings",
    protected: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login Screen",
    protected: false,
  },
];

export default routes;
