import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SearchBox() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  function submitHandler(event) {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      toast.error("Please enter a search term");
      return;
    }

    navigate(`/search/${trimmedKeyword}`);
    setKeyword("");
  }

  return (
    <Form onSubmit={submitHandler} className="d-flex mx-3">
      <Form.Control
        type="text"
        name="search"
        placeholder="Search products..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        className="me-2"
        aria-label="Search products"
      />

      <Button type="submit" variant="outline-light">
        Search
      </Button>
    </Form>
  );
}

export default SearchBox;
