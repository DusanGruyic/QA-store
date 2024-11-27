const Progress = ({ activeStep }) => {
    return (
        <>
            <div className="flex border-2 bg-indigo-200 border-gray-200 rounded justify-center py-4">
                <div className="flex">
                    <div
                        className={`${
                            activeStep === 1
                                ? "bg-white text-indigo-200 border-white animate-bounce"
                                : "border-indigo-300 bg-indigo-200 text-indigo-300"
                        } border-2 h-7 w-1 rounded-full mr-2 mt-2 text-center font-bold`}
                    >
                        1
                    </div>
                    <div className="text-center">Review your Items</div>
                    <hr
                        className={`${
                            activeStep !== 1 ? "bg-indigo-300" : "bg-white"
                        }
                        w-48 h-1 -ml-4 mr-4 my-4 border-0 rounded md:my-10`}
                    />
                </div>
                <div className="flex">
                    <div
                        className={`${
                            activeStep === 2
                                ? "bg-white text-indigo-200 border-white animate-bounce"
                                : "border-indigo-300 bg-indigo-200 text-indigo-300"
                        } border-2 h-7 w-1 rounded-full mr-2 mt-2 text-center font-bold`}
                    >
                        2
                    </div>
                    <div className="text-center">Shipping Information</div>
                    <hr
                        className={`${
                            activeStep !== 2 && activeStep !== 1
                                ? "bg-indigo-300"
                                : "bg-white"
                        } w-48 h-1 -ml-4 mr-4 my-4 border-0 rounded md:my-10`}
                    />
                </div>
                <div className="flex">
                    <div
                        className={`${
                            activeStep === 3
                                ? "bg-white text-indigo-200 border-white animate-bounce"
                                : "border-indigo-300 bg-indigo-200 text-indigo-300"
                        } border-2 h-7 w-1 rounded-full mr-2 mt-2 text-center font-bold`}
                    >
                        3
                    </div>
                    <div className="text-center">Billing Information</div>
                    <hr
                        className={`${
                            activeStep !== 4 ? "bg-white" : "bg-indigo-300"
                        } w-48 h-1 -ml-4 mr-4 my-4 border-0 rounded md:my-10`}
                    />
                </div>
                <div className="flex">
                    <div
                        className={`${
                            activeStep === 4
                                ? "bg-white text-indigo-200 border-white animate-bounce"
                                : "border-indigo-300 bg-indigo-200 text-indigo-300"
                        } border-2 h-7 w-2 rounded-full mr-2 mt-2 text-center font-bold`}
                    >
                        4
                    </div>
                    <div className="text-center">Finalize your Purchase</div>
                </div>
            </div>
        </>
    );
};

export default Progress;
