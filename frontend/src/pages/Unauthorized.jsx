import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Redirect to the login page
  };

  return (
    <div>
      <button onClick={handleBack}>Back</button>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

export default Unauthorized;

