import { Route, Routes } from "react-router-dom";
import PrivateChat from "../../user-chat";
import { classNames } from "../../../lib/utils";

const UserPrivateChat = ({ receiver, submitHandler, submitFileHandler }) => {
  return (
    <div
      className={classNames(
        "border-l border-neutral-700 sm:border-0 w-full h-full text-white"
      )}
    >
      <Routes>
        <Route
          path={`users/${receiver}`}
          element={
            <PrivateChat
              submitHandler={submitHandler}
              submitFileHandler={submitFileHandler}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default UserPrivateChat;
