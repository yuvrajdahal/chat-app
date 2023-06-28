import { Route, Routes } from "react-router-dom";
import { classNames } from "../../../lib/utils";
import Users from "../../users";

const UsersList = ({ onChange, receiver }) => {
  return (
    <div
      className={classNames(
        "w-full sm:basis-64 h-full border-x border-neutral-700 px-2  space-y-1.5",
        receiver?.length > 0 ? "hidden sm:block" : "block"
      )}
    >
      <Routes>
        <Route
          path={`users/*`}
          element={<Users onChangeChatUser={onChange} />}
        />
      </Routes>
    </div>
  );
};
export default UsersList;
