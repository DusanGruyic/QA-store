import Footer from "@/Components/Footer";
import Header from "@/Components/Header";

export default function Guest({ children }) {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col sm:justify-center items-center sm:pt-0 bg-gradient-to-br from-white to-gray-300 h-screen">
                {children}
            </div>
            <Footer />
        </>
    );
}
