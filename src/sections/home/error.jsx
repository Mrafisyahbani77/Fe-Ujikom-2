import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("Terjadi kesalahan.");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");

    if (reason === "auth_failed") {
      setErrorMessage("Autentikasi gagal. Silakan coba lagi.");
    } else if (reason === "server_error") {
      setErrorMessage("Terjadi kesalahan server. Silakan coba lagi nanti.");
    } else if (reason === "missing_tokens") {
      setErrorMessage("Token tidak ditemukan. Silakan login ulang.");
    }

    // Redirect ke halaman login setelah beberapa detik
    setTimeout(() => navigate("/auth/jwt/login"), 1000);
  }, [navigate]);

  return <div>{errorMessage} Mengalihkan ke login...</div>;
}
