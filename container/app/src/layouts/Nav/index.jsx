import { useDispatch, useSelector } from "react-redux";
import { authSelector, logOut } from "../../appstate/auth/auth_slice";
import { TbLogout } from "react-icons/tb";
import { BsFillChatSquareFill } from "react-icons/bs";
import Image from "../../components/Images";
import { useNavigate, useNavigation } from "react-router-dom";

const NavBar = () => {
    const { user, userIsLoading } = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function logOutHandler() {
        dispatch(logOut())
        navigate("/")
    }
    return (
        <div className="basis-20 h-full border-neutral-700 px-1.5">
            <div className="h-full flex flex-col justify-between items-center py-2">
                <button
                    className="px-2 py-2 rounded-md ring-2 ring-dark-placeholder bg-dark-placeholder flex justify-center items-center text-placeholder active:ring-placeholder"
                >
                    <BsFillChatSquareFill className="text-xl" />
                </button>
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-[40px] w-[40px]">
                        <Image source={user?.profilePicture} isLoading={userIsLoading} />
                    </div>
                    <button
                        onClick={logOutHandler}
                        className="h-[40px] w-full rounded-full ring-2 ring-dark-placeholder bg-dark-placeholder focus:ring-placeholder flex justify-center items-center text-placeholder active:bg-placeholder active:text-dark-placeholder"
                    >
                        <TbLogout className="pl-0.5 py-0.5 text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default NavBar