import { classNames } from "../../lib/utils";

const Image = ({ isLoading = false, source, ...rest }) => {
    return (
        <button className={classNames(
            'h-full w-full rounded-full ring-2 ring-dark-placeholder bg-dark-placeholder focus:ring-placeholder',
            isLoading && source && "h-full"
        )}>
            {!isLoading && source && <img
                src={source}
                className={'w-full h-full object-contain'}
                {...rest}
            />}
        </button>
    )
}
export default Image;