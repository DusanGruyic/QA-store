import React from "react";

const Footer = () => {
    return (
        <div className="bottom-0 flex align-items-center justify-center border-2 border-var(--surface-border) border-t sticky bg-gradient-to-b from-white to-gray-300">
            <span>
                © 2024{" "}
                <a
                    className="font-semibold hover:text-gray-600"
                    href="https://www.automaticity.rs/"
                    target="_blank"
                >
                    Automaticity
                </a>
            </span>
            <a
                href="https://www.linkedin.com/company/automaticity-it/mycompany/"
                target="_blank"
            >
                <span className="pi pi-linkedin ml-3"></span>
            </a>
            <a href="mailto:office@automaticity.rs" target="_blank">
                <span className="pi pi-google ml-3"></span>
            </a>
            <a
                href="https://www.instagram.com/automaticity.qa/"
                target="_blank"
            >
                <span className="pi pi-instagram ml-3"></span>
            </a>
            <a href="https://www.facebook.com/automaticity.qa" target="_blank">
                <span className="pi pi-facebook ml-3"></span>
            </a>
        </div>
    );
};

export default Footer;
