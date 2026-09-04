import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user } = useAuth();

  return (
    <section>
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
      <p>Role: {user?.role}</p>
      <p>Status: {user?.status}</p>
    </section>
  );
}

export default Profile;