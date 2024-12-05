import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import "./index.css";

interface Profile {
  imageUrl?: string;
  name?: string;
  email?: string;
}

function App() {
  const clientId1 = "2006525758";
  const redirectUri = "https://main-system-network.pcnone.com/callback.php";

  // สร้าง state สำหรับตรวจสอบ CSRF
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  console.log({ clientId1, redirectUri, state });

  const clientId =
    "242960437265-b0t5dl06ab2mj5nk7pmvm8ah5qeurumj.apps.googleusercontent.com";

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "profile email",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = (res: any) => {
    console.log("Login Success:", res);

    const profileData = res.profileObj;

    // สร้าง URL พร้อม query string
    const params = new URLSearchParams({
      imageUrl: profileData.imageUrl,
      name: profileData.name,
      email: profileData.email,
    });

    const targetUrl = `https://main-system-network.pcnone.com/get?${params.toString()}`;

    // Log out immediately
    gapi.auth2.getAuthInstance().signOut();
    console.log("Logged out immediately");

    // Redirect to target URL
    window.location.href = targetUrl;
  };

  const onFailure = (res: any) => {
    console.error("Login Failed:", res);
  };

  const logOut = () => {
    setProfile(null);
    console.log("Logout Success");
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Full height of the screen
      backgroundColor: "#f5f5f5", // Light gray background color
    },
    card: {
      maxWidth: "24rem", // Maximum width for the card
      width: "100%", // Full width within the max limit
      backgroundColor: "white", // Card background color
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
      borderRadius: "8px", // Rounded corners
      overflow: "hidden", // Prevent overflow of content
    },
    cardContent: {
      padding: "1.5rem", // Padding inside the card
    },
    heading: {
      fontSize: "1.25rem", // Font size for the heading
      fontWeight: "600", // Semi-bold font weight
      textAlign: "center" as "center", // Specify as a valid string literal type
      color: "#2d3748", // Dark text color
      marginBottom: "1rem", // Bottom margin for spacing
    },
    paragraph: {
      textAlign: "center" as "center", // Specify as a valid string literal type
      color: "#4a5568", // Lighter gray color for the paragraph
      marginBottom: "1rem", // Bottom margin for spacing
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center", // Center the button horizontally
    },
    button: {
      backgroundColor: "#3182ce", // Blue background color
      color: "white", // White text color
      padding: "0.5rem 1rem", // Padding for the button
      borderRadius: "9999px", // Fully rounded button
      cursor: "pointer", // Pointer cursor on hover
      border: "none", // Remove border
      textAlign: "center" as "center", // Specify as a valid string literal type
    },
  };

  return (
    <div style={styles.container}>
      {profile ? (
        <></>
      ) : (
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <h2 style={styles.heading}>PCNONE NETWORK</h2>
            <p style={styles.paragraph}>โครงการเน็ตบ้านหลังละ 100</p>
            <div style={styles.buttonContainer}>
              <GoogleLogin
                clientId={clientId}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
                isSignedIn={true}
                style={styles.button} // Applying the button style
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
