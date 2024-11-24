import React from "react";

interface PaginationOptions {
    size: number;
    page: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

interface PaginationProps {
    options: PaginationOptions;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ options, onPageChange }) => {
    const { page, totalPages, hasNextPage, hasPreviousPage, nextPage, prevPage } = options;

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i}>
                    <a
                        href="#"
                        onClick={() => onPageChange(i)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight ${
                            i === page
                                ? "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                    >
                        {i}
                    </a>
                </li>
            );
        }
        return pages;
    };

    return (
        <nav className="flex items-center justify-center mt-4 mb-1">
            <ul className="flex items-center -space-x-px h-8 text-sm">
                <li>
                    <a
                        href="#"
                        onClick={() => prevPage && onPageChange(prevPage)}
                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight ${
                            hasPreviousPage
                                ? "text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                : "text-gray-300 bg-gray-200 border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                        }`}
                        aria-disabled={!hasPreviousPage}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </a>
                </li>

                {renderPageNumbers()}

                <li>
                    <a
                        href="#"
                        onClick={() => nextPage && onPageChange(nextPage)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight ${
                            hasNextPage
                                ? "text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                : "text-gray-300 bg-gray-200 border border-gray-300 rounded-e-lg cursor-not-allowed"
                        }`}
                        aria-disabled={!hasNextPage}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
