import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";

import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useParams } from "react-router-dom";

const HomeScreen = () => {
  const { keyword } = useParams();
  const { data: products, isLoading, error } = useGetProductsQuery({ keyword });
  return (
    <>
      <h1 className="mt-4 mb-3 text-center">LATEST PRODUCTS</h1>

      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <Row className="justify-content-center gy-4">
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};
export default HomeScreen;
