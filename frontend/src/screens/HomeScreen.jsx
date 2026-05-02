import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";

import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword && <ProductCarousel />}

      <h1 className="mt-4 mb-3 text-center">LATEST PRODUCTS</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {data.products.length === 0 ? (
            <Message>
              No products found{keyword ? ` for "${keyword}"` : ""}.
            </Message>
          ) : (
            <Row className="justify-content-center gy-4 mb-4">
              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}

          {data.products.length > 0 && (
            <div className="d-flex justify-content-center mt-4 mb-4">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ""}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
export default HomeScreen;
