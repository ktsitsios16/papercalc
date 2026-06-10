export function paginateCutList(list, firstPageCount, otherPageCount) {
  const pages = [];
  let index = 0;

  // πρώτη σελίδα
  pages.push(list.slice(0, firstPageCount));
  index = firstPageCount;

  // επόμενες σελίδες
  while (index < list.length) {
    pages.push(list.slice(index, index + otherPageCount));
    index += otherPageCount;
  }

  return pages;
}

