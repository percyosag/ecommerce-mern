import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <Row>
          <Col md={5}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className="border border-secondary"
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark text-light border-secondary">
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-light border-secondary">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-light border-secondary">
                Price: ${product.price}
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-light border-secondary">
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card className="bg-dark text-light border-secondary">
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-dark text-light border-secondary">
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="bg-dark text-light border-secondary">
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="bg-dark text-light">
                  <Button
                    className="btn-block w-100 btn-primary"
                    type="button"
                    disabled={product.countInStock === 0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
