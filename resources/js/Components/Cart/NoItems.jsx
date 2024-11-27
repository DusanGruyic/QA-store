import EmptyCartIcon from "../Icons/EmptyCartIcon";

const NoItems = () => {
    return (
        <div className="h-screen">
            <div className="z-10 text-4xl font-bold sm:mt-12 md:mt-12 mb-6">
                No items in cart. Add some!
            </div>
            <div className="z-0">
                <EmptyCartIcon />
            </div>
        </div>
    );
};

export default NoItems;
