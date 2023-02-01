import Button from "../../components/Button";
import Link from "../../components/Button/LinkButton";
import Input from "../../components/Input";
import { useSignupMutation } from "../../appstate/auth/auth_service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { useEffect } from "react";
const Signup = () => {
  const [signup, { isLoading, isError, isSuccess, error }] =
    useSignupMutation();
  const { add } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
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
  function onSignupHandler(e) {
    e.preventDefault();
    signup(formState);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-2">
      <div
        className={`mobile:w-full md:w-[60%] lg:w-[40%] mobile:h-full bg-dark-placeholder rounded-lg flex flex-col items-center py-2 px-4`}
      >
        <div className="h-14 w-14 ">
          <img src="assets/logo.svg" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col pt-2 items-center  ">
          <span className="font-bold text-2xl text-primary-text">
            Get Started
          </span>
          <span className="text-secondary-text text-xl tracking-wider">
            {isSuccess ? (
              <span className="text-red-500">
                Check your gmail for verification
              </span>
            ) : (
              "Create account to chat"
            )}
          </span>
        </div>
        <form className="w-full" onSubmit={onSignupHandler}>
          <div className="w-full flex pt-6 flex-col gap-2  gap-4">
            <Input
              variant="outline"
              className="h-10"
              placeholder="Enter name"
              name="name"
              value={formState.name}
              onChange={changeHandler}
              required
            />
            <Input
              variant="outline"
              className="h-10"
              type="email"
              placeholder="Enter email"
              required
              value={formState.email}
              name="email"
              onChange={changeHandler}
            />
            <Input
              variant="outline"
              className="h-10"
              placeholder="Enter password"
              type={toggleType ? "text" : "password"}
              value={formState.password}
              name="password"
              onChange={changeHandler}
              required
            />
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
            {isLoading ? "..." : "Signup"}
          </Button>
        </form>
        <div className="inline-flex items-center gap-2 text-primary-text text-lg pt-4">
          Already have a account?{" "}
          <Link
            as="span"
            to="login"
            className="text-accent font-bold cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;
