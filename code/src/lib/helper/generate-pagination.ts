export function generatePagination(currentPage: number, totalPages: number) {
    // show only 7 pages buttons max (if less than or equal then show all)
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // siblings are adjacent page numbers to the current page (1 2 [3] 4 5)
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    // show ellipsis when gap is more than 1 (5 ... 7)
    const shouldShowLeftDots = leftSiblingIndex > 3;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // close to start case
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // close to end case
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // middle case
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        "...",
        leftSiblingIndex,
        currentPage,
        rightSiblingIndex,
        "...",
        totalPages,
      ];
    }

    return [];
  }