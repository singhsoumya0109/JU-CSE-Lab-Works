import React, { useState, useEffect, useCallback } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import debounce from "lodash.debounce";

const Navbar = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingChat, setLoadingChat] = useState();


  // Function to perform search
  const performSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/user/search?search=${query}`, config);
      setSearchResult(data);
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred while searching. Please try again later.");
    }
    setLoading(false);
  };

    //function to access user
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

          const { data } = await axios.post("/chat", { userId }, config);
          if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
        }
        catch (error) {
            console.error("Error during accessing chat:", error);
            alert(
                "An error occurred while accessing chat. Please try again later."
            );
        }
    };
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => performSearch(query), 500),
    []
  );

  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedSearch(query);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ccc",
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {/* Search Bar Section */}
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleInputChange}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
          {search && searchResult.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                width: "100%",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {searchResult.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #f1f1f1",
                    cursor: "pointer",
                  }}
                  onClick={() => accessChat(result._id)} // Customize click behavior
                >
                  {result.name || "Result"} {/* Customize this */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* App Title Section */}
        <div
          style={{
            textAlign: "center",
            flex: 2,
          }}
        >
          <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>
            Chatting App
          </h2>
        </div>

        {/* User Dropdown Section */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {user?.pic && (
              <img
                src={user.pic}
                alt="Avatar"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  border: "1px solid #ccc",
                }}
              />
            )}
            <span
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              {user?.name || "Guest"}
            </span>
          </div>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: "1000",
                width: "150px",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  display: "block",
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  border: "none",
                  textAlign: "left",
                  width: "100%",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
