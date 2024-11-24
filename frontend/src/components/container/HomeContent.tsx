import React, {useEffect, useState} from "react";

interface HomeContentProps {
    children: React.ReactNode;
}

const HomeContent: React.FC<HomeContentProps> = ({ children }) => {
    const [isScrolling, setIsScrolling] = useState(false);


    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            setIsScrolling(true);

            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setIsScrolling(false);
            }, 3000);
        };

        const container = document.querySelector(".custom-overflow-y");
        container?.addEventListener("scroll", handleScroll);

        return () => {
            container?.removeEventListener("scroll", handleScroll);
            clearTimeout(timeout);
        };
    }, []);
    return (
        <div className={`bg-white h-screen max-h-[99%] ps-3 py-3 rounded-xl shadow shadow-gray-400`}>
            <div className={`h-screen max-h-[99%] custom-overflow-y ${isScrolling ? "show-scrollbar" : ""}`}>
                    {children}
            </div>
        </div>
    );
}

export default HomeContent;
