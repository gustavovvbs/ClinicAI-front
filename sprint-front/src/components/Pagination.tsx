
interface PaginationProps {
    page: string;
    handlePageChange: (page: string) => void;
    totalPages: number;
}

export default function Pagination({ page, handlePageChange, totalPages }: PaginationProps) {
    
    // im managing it using the parent state from the prop, thus not making the page part of the query, but rather a state of the parent component.
    const currentPage = Number(page);

    const handlePageClick = (pageNumber: number) => {
        handlePageChange(pageNumber.toString());
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5; 
        const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

        let startPage = Math.max(2, currentPage - halfPageNumbersToShow);
        let endPage = Math.min(totalPages - 1, currentPage + halfPageNumbersToShow);

        if (currentPage <= halfPageNumbersToShow + 1) {
            startPage = 2;
            endPage = Math.min(totalPages - 1, maxPageNumbersToShow + 1);
        } 
        else if (currentPage + halfPageNumbersToShow >= totalPages) {
            startPage = Math.max(2, totalPages - maxPageNumbersToShow);
            endPage = totalPages - 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex justify-center items-center mt-10">
            <ul className="flex space-x-1">
                {currentPage > 1 && (
                    <li>
                        <button
                            onClick={() => handlePageClick(currentPage - 1)}
                            className="px-3 py-2 border border-brandDarkBlue bg-brandWhite text-brandDarkBlue hover:bg-brandLightBlue transition"
                            aria-label="Página Anterior"
                        >
                            Previous
                        </button>
                    </li>
                )}

                <li>
                    <button
                        onClick={() => handlePageClick(1)}
                        className={`px-3 py-2 rounded-l-md ${
                            currentPage === 1 ? 'bg-brandDarkBlue text-brandWhite' : 'bg-brandWhite text-brandDarkBlue hover:bg-brandLightBlue transition'
                        } border border-brandDarkBlue`}
                        aria-label="Página 1"
                    >
                        1
                    </button>
                </li>

                {pageNumbers.length > 0 && pageNumbers[0] > 2 && (
                    <li>
                        <span className="px-3 py-2 text-gray-500">...</span>
                    </li>
                )}

                {pageNumbers.map((pageNumber) => (
                    <li key={pageNumber}>
                        <button
                            onClick={() => handlePageClick(pageNumber)}
                            className={`px-3 py-2 ${
                                currentPage === pageNumber ? 'bg-brandDarkBlue text-brandWhite' : 'bg-brandWhite text-brandDarkBlue hover:bg-brandLightBlue transition'
                            } border border-brandDarkBlue`}
                            aria-label={`Página ${pageNumber}`}
                        >
                            {pageNumber}
                        </button>
                    </li>
                ))}

                {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <li>
                        <span className="px-3 py-2 text-gray-500">...</span>
                    </li>
                )}

                {totalPages > 1 && (
                    <li>
                        <button
                            onClick={() => handlePageClick(totalPages)}
                            className={`px-3 py-2 rounded-r-md ${
                                currentPage === totalPages ? 'bg-brandDarkBlue text-brandWhite' : 'bg-brandWhite text-brandDarkBlue hover:bg-brandLightBlue transition'
                            } border border-brandDarkBlue`}
                            aria-label={`Página ${totalPages}`}
                        >
                            {totalPages}
                        </button>
                    </li>
                )}

                {currentPage < totalPages && (
                    <li>
                        <button
                            onClick={() => handlePageClick(currentPage + 1)}
                            className="px-3 py-2 border border-brandDarkBlue bg-brandWhite text-brandDarkBlue hover:bg-brandLightBlue transition"
                            aria-label="Próxima Página"
                        >
                            Next
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}
