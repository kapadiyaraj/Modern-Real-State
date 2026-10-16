


// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const AuthContext = createContext();

// const SERVER = "http://localhost:5000";

// // Backend endpoint that returns the currently logged-in user
// const AUTH_ME_URL = `${SERVER}/api/auth/me`;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] =
//     useState(false);
//   const [authLoading, setAuthLoading] = useState(true);

//   /*
//   |--------------------------------------------------------------------------
//   | Save user ID
//   |--------------------------------------------------------------------------
//   */
//   const saveUserId = (userData) => {
//     const userId =
//       userData?._id ||
//       userData?.id ||
//       userData?.userId;

//     if (userId) {
//       localStorage.setItem(
//         "userId",
//         String(userId)
//       );
//     } else {
//       localStorage.removeItem("userId");
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Load current user from backend
//   |--------------------------------------------------------------------------
//   */
//   const loadCurrentUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setUser(null);
//       setIsAuthenticated(false);
//       setAuthLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         AUTH_ME_URL,
//         {
//           method: "GET",

//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to verify user session"
//         );
//       }

//       /*
//        * Support different backend response formats:
//        *
//        * { success: true, data: user }
//        * { success: true, user: user }
//        */
//       const currentUser =
//         result.data ||
//         result.user ||
//         result.data?.user;

//       if (!currentUser) {
//         throw new Error(
//           "User data not found in response"
//         );
//       }

//       // Save fresh MongoDB user
//       localStorage.setItem(
//         "user",
//         JSON.stringify(currentUser)
//       );

//       saveUserId(currentUser);

//       setUser(currentUser);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error(
//         "AUTH USER REFRESH ERROR:",
//         error
//       );

//       /*
//        * If token is invalid/expired, clear session.
//        */
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");

//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Check authentication when app starts
//   |--------------------------------------------------------------------------
//   */
//   useEffect(() => {
//     loadCurrentUser();
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | Login
//   |--------------------------------------------------------------------------
//   */
//   const login = (userData, token) => {
//     if (!userData || !token) {
//       console.error(
//         "Login failed: user data or token missing"
//       );
//       return;
//     }

//     localStorage.setItem(
//       "user",
//       JSON.stringify(userData)
//     );

//     localStorage.setItem(
//       "token",
//       token
//     );

//     saveUserId(userData);

//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Logout
//   |--------------------------------------------------------------------------
//   */
//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");

//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         authLoading,
//         login,
//         logout,
//         loadCurrentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /*
// |--------------------------------------------------------------------------
// | useAuth
// |--------------------------------------------------------------------------
// */
// export const useAuth = () => {
//   return useContext(AuthContext);
// };



import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const SERVER = "http://localhost:5000";
const AUTH_ME_URL = `${SERVER}/api/auth/me`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [authLoading, setAuthLoading] =
    useState(true);

  // ======================================================
  // SAVE USER ID
  // ======================================================

  const saveUserId = (userData) => {
    const userId =
      userData?._id ||
      userData?.id ||
      userData?.userId;

    if (userId) {
      localStorage.setItem(
        "userId",
        String(userId)
      );
    }
  };

  // ======================================================
  // GET CURRENT USER
  // ======================================================

  const loadCurrentUser = async () => {
    const token =
      localStorage.getItem("token");

    // No token = not logged in
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch(
        AUTH_ME_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "AUTH /ME RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Failed to verify user session"
        );
      }

      const currentUser =
        result?.data ||
        result?.user;

      if (!currentUser) {
        throw new Error(
          "User data not found"
        );
      }

      // Save fresh user
      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );

      saveUserId(currentUser);

      setUser(currentUser);
      setIsAuthenticated(true);

      console.log(
        "AUTH USER:",
        currentUser
      );
    } catch (error) {
      console.error(
        "AUTH USER REFRESH ERROR:",
        error
      );

      /*
       * Do NOT immediately delete the token here.
       *
       * This prevents the token from disappearing because
       * of a temporary /me request problem.
       */

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser);

          setUser(parsedUser);
          setIsAuthenticated(true);

          console.warn(
            "Using stored user because /me failed."
          );
        } catch (parseError) {
          console.error(
            "STORED USER PARSE ERROR:",
            parseError
          );

          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ======================================================
  // INITIAL AUTH CHECK
  // ======================================================

  useEffect(() => {
    loadCurrentUser();
  }, []);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = (userData, token) => {
    console.log(
      "LOGIN CONTEXT USER:",
      userData
    );

    console.log(
      "LOGIN CONTEXT TOKEN:",
      token
    );

    if (!userData || !token) {
      console.error(
        "Login failed: user data or token missing"
      );
      return false;
    }

    const cleanToken = String(token)
      .replace(/^Bearer\s+/i, "")
      .trim();

    // Save token
    localStorage.setItem(
      "token",
      cleanToken
    );

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    saveUserId(userData);

    // Update React state
    setUser(userData);
    setIsAuthenticated(true);

    console.log(
      "TOKEN SAVED:",
      localStorage.getItem("token")
    );

    return true;
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Remove older token names also
    localStorage.removeItem("adminToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userToken");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");

    setUser(null);
    setIsAuthenticated(false);
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================================================
// USE AUTH
// ======================================================

export const useAuth = () => {
  return useContext(AuthContext);
};

