import React from "react";
import '../../styles/Pagination.css'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pagesToShow = 9;

    const pages = Array.from({ length: Math.min(totalPages, pagesToShow) }, (_, index) => index + 1);

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Предыдущая
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? "active" : ""}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Следующая
            </button>
        </div>
    );
}

export default Pagination;
