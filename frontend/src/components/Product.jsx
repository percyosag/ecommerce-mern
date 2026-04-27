import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded bg-dark border-secondary text-light">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div" className="product-title text-light">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            {product.rating} stars from {product.numReviews} reviews
          </div>
        </Card.Text>

        <Card.Text as="h3" className="text-primary">
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
