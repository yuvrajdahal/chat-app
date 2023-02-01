import Link from "../../components/Button/LinkButton";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { useLoginMutation } from "../../appstate/auth/auth_service";
import { useNavigate, redirect } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../../components/Toast";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading, isError, error }] = useLoginMutation();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const { add } = useToast();
  const [toggleType, setToggleType] = useState(false);
  const changeHandler = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === "checkbox" ? e.target.check : e.target.value;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  async function onLoginHandler(e) {
    e.preventDefault();
    const { data } = await loginUser(formState);
    if (data?.success) {
      navigate("/chats/users");
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-2">
      <div
        className={`mobile:w-full md:w-[60%] lg:w-[40%] mobile:h-full bg-dark-placeholder rounded-lg flex flex-col items-center py-2 px-4`}
      >
        <div className="h-14 w-14">
          <img src="assets/logo.svg" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col pt-2 items-center  ">
          <span className="font-bold text-2xl text-primary-text">
            Welcome Back
          </span>
          <span className="flex flex-col text-secondary-text text-xl tracking-wider">
            Login your account to chat
          </span>
        </div>
        <form className="w-full" onSubmit={onLoginHandler}>
          <div className="w-full flex pt-6 flex-col gap-2  gap-4">
            <Input
              variant="outline"
              className="h-10"
              type="email"
              placeholder="Enter email"
              value={formState.email}
              required
              name="email"
              onChange={changeHandler}
            />
            <Input
              variant="outline"
              className="h-10"
              placeholder="Enter password"
              type={toggleType ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={changeHandler}
              required
            />{" "}
            <div className="flex gap-2 item-center">
              <Input
                variant="checkbox"
                className=""
                type="checkbox"
                onChange={(e) => {
                  setToggleType(e.target.checked);
                }}
              />
              <span className="text-primary-text">Show Password</span>
            </div>
          </div>
          <Button variant="normal" className="mt-4" type="submit">
            {isLoading ? "..." : "Login"}
          </Button>
        </form>
        <div className="inline-flex items-center gap-2 text-primary-text text-lg mt-4">
          New in this platform?{" "}
          <Link
            as="span"
            to="/"
            className="text-accent font-bold cursor-pointer"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
