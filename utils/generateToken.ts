import jwt from "jsonwebtoken";

const apiSecret = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_SECRET ?? ""; // Load your API secret from the .env file

// Calculate iat (current time) and exp (one month from now)
const iat = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
const exp = iat + 30 * 24 * 60 * 60; // One month (30 days) in seconds from iat

function generateToken(userId: string) {
  // Create the payload with the provided details
  const payload = {
    user_id: userId,
    iss: "https://pronto.getstream.io",
    sub: `user/${userId}`,
    iat: iat,
    exp: exp,
  };

  // Generate the JWT token
  const token = jwt.sign(payload, apiSecret, {
    algorithm: "HS256",
    header: {
      typ: "JWT",
      alg: "HS256",
    },
  });

  return token;
}

export default generateToken;
