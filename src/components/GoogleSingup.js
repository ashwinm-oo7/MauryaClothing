import React from "react";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const GoogleSingup = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log("ClientID", clientId);

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log(credentialResponse);
      // Validate Google credentialResponse
      if (!credentialResponse || !credentialResponse.credential) {
        toast.error("Invalid Google response. Please try again.");
        return;
      }
      const googleCredential = credentialResponse.credential;

      // Send the token to your backend for verification
      const response = await fetch(
        process.env.REACT_APP_API_URL + "user/google-signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: googleCredential }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error verifying token:", errorData);
        toast.error(errorData.message || "Google Sign-In failed.");
        return;
      }

      const userData = await response.json();
      // Save user details in localStorage or state (based on your logic)
      localStorage.setItem("userId", userData._id);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("isAdmin", userData.isAdmin);
      toast.success("Google Sign-In successful!");
      window.location.href = "/home"; // Redirect to the home page
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast.error("An error occurred during Google Sign-In. Please try again.");
    }
  };

  const handleError = () => {
    toast.error(
      "Google Sign-In failed. Please check your internet connection or try again."
    );
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ marginTop: "20px" }}>
        <h3>Or Signup with Google</h3>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSingup;
