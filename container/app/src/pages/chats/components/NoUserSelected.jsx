import Text from "../../../components/Text";

const NoUserSelected = () => {
  return (
    <div className="h-full w-full hidden sm:flex flex-col justify-center items-center">
      <div className="h-[300px] w-[300px] my-8">
        <img src="/assets/nouserrobot-1.gif" className="h-full w-full" />
      </div>
      <Text
        variant="primary"
        className="relative -top-[40px] text-xl font-bold mt-2"
      >
        No user selected
      </Text>
    </div>
  );
};
export default NoUserSelected;
