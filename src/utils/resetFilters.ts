export const resetFilters = () => {
  localStorage.removeItem("currentPage");
  localStorage.removeItem("postsPerPage");
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("scrollPosition");
}