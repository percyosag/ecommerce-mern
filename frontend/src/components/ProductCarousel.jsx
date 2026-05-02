import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";

import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`} className="carousel-link">
            <div className="carousel-slide">
              <div className="carousel-image-wrapper">
                <Image
                  src={product.image}
                  alt={product.name}
                  fluid
                  className="carousel-image"
                />
              </div>

              <div className="carousel-text">
                <span className="carousel-eyebrow">Top Rated</span>
                <h2>{product.name}</h2>
                <p>${Number(product.price).toFixed(2)}</p>
                <span className="carousel-cta">Shop Now</span>
              </div>
            </div>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
