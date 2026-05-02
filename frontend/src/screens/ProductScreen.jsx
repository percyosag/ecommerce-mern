import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };
  async function submitReviewHandler(event) {
    event.preventDefault();

    if (!rating || !comment.trim()) {
      toast.error("Please select a rating and enter a comment");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      await refetch();

      setRating(0);
      setComment("");

      toast.success("Review submitted successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Review submission failed",
      );
    }
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
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

                  {product.countInStock > 0 && (
                    <ListGroup.Item className="bg-dark text-light border-secondary">
                      <Row className="align-items-center">
                        <Col>Qty</Col>
                        <Col>
                          {product.countInStock > 10 ? (
                            /* Numeric Input for High Stock (11+) */
                            <Form.Control
                              type="number"
                              value={qty}
                              min={1}
                              max={product.countInStock}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                // Validation to prevent ordering more than stock or less than 1
                                if (val > product.countInStock)
                                  setQty(product.countInStock);
                                else if (val < 1) setQty(1);
                                else setQty(val);
                              }}
                              className="bg-secondary text-white border-0"
                            />
                          ) : (
                            /* Standard Dropdown for Low Stock (1-10) */
                            <Form.Control
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                              className="form-select bg-secondary text-white border-0"
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ),
                              )}
                            </Form.Control>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="bg-dark text-light border-secondary">
                    <Button
                      className="btn-block w-100 btn-primary"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="review mt-4">
            <Col md={6}>
              <h2>Reviews</h2>

              {product.reviews?.length === 0 && (
                <Message>No reviews yet.</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews?.map((review) => (
                  <ListGroup.Item
                    key={review._id}
                    className="bg-dark text-light border-secondary"
                  >
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt?.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item className="bg-dark text-light border-secondary">
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(event) =>
                            setRating(Number(event.target.value))
                          }
                          className="form-select bg-secondary text-white border-0"
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          className="bg-secondary text-white border-0"
                        />
                      </Form.Group>

                      <Button type="submit" variant="primary" className="my-3">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review.
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
