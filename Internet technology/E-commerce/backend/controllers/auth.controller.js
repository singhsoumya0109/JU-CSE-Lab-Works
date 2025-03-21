import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  
  return { accessToken, refreshToken };

};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  });


  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7*24 * 60 * 60*1000,
  });
}

export const signup = async (req, res) => {
  const { name, email, password, role = "customer" } = req.body;

  if (!["customer", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await User.create({ name, email, password, role });

  const { accessToken, refreshToken } = generateToken(newUser._id);
  await storeRefreshToken(newUser._id, refreshToken);
  setCookies(res, accessToken, refreshToken);

  res.status(201).json({
    newUser: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    message: "User created successfully",
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password)))
    {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
    else {
      res.status(401).json({ message: "Invalid passord or email" });
    }
  }
  catch (error)
  {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });

  }
};


export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // Ensure Redis is connected before calling `del()`
        if (redis.status === "ready") {
          await redis.del(`refresh_token:${decoded.userId}`);
        } else {
          console.error("Redis is not connected. Skipping token deletion.");
        }
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError.message);
        // Don't throw error here, still proceed with clearing cookies
      }
    }

    // Always clear cookies, even if refreshToken was invalid or missing
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


// export const refreshToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken)
//     {
//       return res.status(401).json({ message: "No refresh token provided" });
//     }
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

//     if (storedToken !== refreshToken)
//     {
//       return res.status(401).json({ message: "Invalid refresh token" });
//     }
//     const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 15 * 60 * 1000,
//     });

//     res.json({ message: "Token refreshed successfully" });

//   }
//   catch (error)
//   {
//     console.log("Error in refreshToken controller", error.message);
//     res.status(500).json({ message: "Server error", error:error.message });
//   }
// }


export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const oldTokenPayload = decoded; // Extract old token details
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // console.log("Old Token Payload:", oldTokenPayload);
    // console.log("New Access Token:", accessToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


