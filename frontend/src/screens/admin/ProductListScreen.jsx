import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

function ProductListScreen() {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  async function deleteHandler(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId).unwrap();
      await refetch();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Could not delete product",
      );
    }
  }

  async function createProductHandler() {
    if (!window.confirm("Are you sure you want to create a new product?")) {
      return;
    }

    try {
      const createdProduct = await createProduct().unwrap();
      toast.success("Product created successfully");
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Could not create product",
      );
    }
  }
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className="text-end">
          <Button className="btn-sm my-3" onClick={createProductHandler}>
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data?.products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {data && <Paginate pages={data.pages} page={data.page} isAdmin={true} />}
    </>
  );
}

export default ProductListScreen;
