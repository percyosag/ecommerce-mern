import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../slices/productsApiSlice";

function ProductEditScreen() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const currentFormData = formData || {
    name: product?.name || "",
    price: product?.price || "",
    image: product?.image || "",
    brand: product?.brand || "",
    category: product?.category || "",
    countInStock: product?.countInStock || "",
    description: product?.description || "",
  };

  function changeHandler(event) {
    const { name, value } = event.target;

    setFormData({
      ...currentFormData,
      [name]: value,
    });
  }
  async function submitHandler(event) {
    event.preventDefault();

    try {
      await updateProduct({
        productId,
        name: currentFormData.name,
        price: Number(currentFormData.price),
        image: currentFormData.image,
        brand: currentFormData.brand,
        category: currentFormData.category,
        countInStock: Number(currentFormData.countInStock),
        description: currentFormData.description,
      }).unwrap();

      toast.success("Product updated successfully");
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Product update failed");
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter product name"
                value={currentFormData.name}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                step="0.01"
                placeholder="Enter price"
                value={currentFormData.price}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={currentFormData.image}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                placeholder="Enter brand"
                value={currentFormData.brand}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                name="countInStock"
                placeholder="Enter count in stock"
                value={currentFormData.countInStock}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={currentFormData.category}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                placeholder="Enter description"
                value={currentFormData.description}
                onChange={changeHandler}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ProductEditScreen;
