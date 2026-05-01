import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

function UserEditScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  const { data: user, isLoading, error } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const currentFormData = formData || {
    name: user?.name || "",
    email: user?.email || "",
    isAdmin: user?.isAdmin || false,
  };

  function changeHandler(event) {
    const { name, value, checked, type } = event.target;

    setFormData({
      ...currentFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function submitHandler(event) {
    event.preventDefault();

    try {
      await updateUser({
        userId,
        name: currentFormData.name,
        email: currentFormData.email,
        isAdmin: currentFormData.isAdmin,
      }).unwrap();

      toast.success("User updated successfully");
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "User update failed");
    }
  }

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>

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
                placeholder="Enter name"
                value={currentFormData.name}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={currentFormData.email}
                onChange={changeHandler}
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-3">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                name="isAdmin"
                checked={currentFormData.isAdmin}
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

export default UserEditScreen;
