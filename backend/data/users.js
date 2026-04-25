const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: "password123", // Clean, raw password. Our model will hash it.
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@email.com",
    password: "password123",
  },
  {
    name: "Jane Doe",
    email: "jane@email.com",
    password: "password123",
  },
];

export default users;
