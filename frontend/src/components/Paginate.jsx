import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {
  if (pages <= 1) {
    return null;
  }

  return (
    <Pagination>
      {[...Array(pages).keys()].map((pageNumber) => (
        <LinkContainer
          key={pageNumber + 1}
          to={
            isAdmin
              ? `/admin/productlist/${pageNumber + 1}`
              : keyword
                ? `/search/${keyword}/page/${pageNumber + 1}`
                : `/page/${pageNumber + 1}`
          }
        >
          <Pagination.Item active={pageNumber + 1 === page}>
            {pageNumber + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
}

export default Paginate;
