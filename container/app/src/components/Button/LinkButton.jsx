import { Link as RouterLink } from "react-router-dom";
import Button from ".";
const Link = ({ to = "/", as = Button, children, ...rest }) => {
  const Component = as;
  return (
    <RouterLink to={to}>
      <Component {...rest}>{children}</Component>
    </RouterLink>
  );
};
export default Link;
