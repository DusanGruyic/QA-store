import FullStar from "./FullStar";
import EmptyStar from "./EmptyStar";
import HalfStar from "./HalfStar";

const Rating = ({ rating }) => {
    let stars = [];

    for (let i = 1; i <= rating.split(".")[0]; i++) {
        stars.push(<FullStar key={i} />);
    }

    if (rating.split(".")[1] > 4) {
        stars.push(<HalfStar key={stars.length + 1} />);
    }

    while (stars.length < 5) {
        stars.push(<EmptyStar key={stars.length + 1} />);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-10">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {" "}
                    {stars}
                    <span className="border-2 border-indigo-200 text-blue-800 text-xs font-semibold px-0.5 ml-4  rounded ">
                        {rating}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Rating;
