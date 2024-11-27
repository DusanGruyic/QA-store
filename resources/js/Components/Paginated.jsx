import { Button } from "primereact/button";

const Paginated = ({
    productsPerPage,
    length,
    handlePagination,
    currentPage,
}) => {
    const paginationNumbers = [];

    for (let i = 1; i <= Math.ceil(length / productsPerPage); i++) {
        paginationNumbers.push(i);
    }

    return (
        <div className="paginated w-full flex justify-center">
            {paginationNumbers.map((data) => (
                <Button
                    label={data}
                    key={data}
                    onClick={() => handlePagination(data)}
                    className={`${
                        currentPage === data
                            ? "bg-indigo-300 text-white"
                            : "bg-gray-100"
                    } text-primary hover:bg-indigo-300 hover:text-white mr-2 mb-2 mt-2 px-2 border border-indigo-700 rounded `}
                />
            ))}
        </div>
    );
};

export default Paginated;
