/*import React, { useState } from "react";
import styled from "styled-components";
import {
    CalendarToday,
    LocationSearching,
    MailLockOutlined,
    PermIdentity,
    PhoneAndroid,
    Publish,
    Logout,
    DeleteOutline,
    FavoriteBorder,
    FeedbackOutlined,
    History,
  } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { publicRequest,userRequest } from "../requestMethods";
import { addNotification } from "../redux/userRedux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";
import Navbar from "../Components/Navbar";
import Wishlist from "../Components/Announcement"; // Assuming you have this component
import Orders from "../Components/Whychooseus"; // Assuming you have this component


// Styled components

const Container = styled.div``
const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f0f2f5;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 80px auto; // Add margin to push it below the navbar 
  z-index: 0; // Ensure it is beneath the navbar 
  position: relative;
`;

const UserTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const UserTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const MenuButton = styled.div`
  position: relative;
`;

const MenuIcon = styled(MoreVert)`
  cursor: pointer;
`;

const MenuContent = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const UserContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserShow = styled.div`
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const UserShowTop = styled.div`
  display: flex;
  align-items: center;
`;

const UserShowImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const UserShowTopTitle = styled.div``;

const UserShowUsername = styled.span`
  font-weight: 600;
  font-size: 20px;
  color: #333;
`;

const UserShowUserTitle = styled.span`
  font-size: 16px;
  color: #777;
  margin-top: 5px;
  display: block;
`;

const UserShowBottom = styled.div`
  margin-top: 20px;
`;

const UserShowTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
  display: block;
`;

const UserShowInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #555;
`;

const UserShowIcon = styled.div`
  font-size: 20px;
  margin-right: 10px;
  color: #4caf50;
`;

const UserShowInfoText = styled.span`
  font-size: 16px;
`;

const UserUpdate = styled.div`
  flex: 2;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const UserUpdateTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const UserUpdateForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserUpdateLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const UserUpdateLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
`;

const UserUpdateInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  &:focus {
    border-color: #4caf50;
  }
`;

const UserUpdateRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserUpdateUpload = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const UserUpdateImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const UserUpdateButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

// Component logic
const Profile = (us) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { userId } = useParams();
  console.log("userid", currentUser._id);
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [formValues, setFormValues] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    jobTitle: "",
  });


  const [activeComponent, setActiveComponent] = useState(""); 

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty or undefined date strings
  
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date
    
    return date.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
  };

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const res = await userRequest.get(`/users/find/${currentUser._id}`, {
        headers: { token: `Bearer ${currentUser.accessToken}` },
      });
      setUser(res.data);
      setFormValues({
        username: res.data.username || "",
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        birthDate: res.data.birthDate || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        jobTitle: res.data.jobTitle || "",
      });
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, currentUser.accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let updatedUser = { ...formValues };

    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Failed to upload file:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedUser = { ...updatedUser, avatar: downloadURL };
            await updateUser(updatedUser);
            await fetchUser();
          } catch (error) {
            console.error("Failed to get download URL:", error);
          }
        }
      );
    } else {
      await updateUser(updatedUser);
      await fetchUser();
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await publicRequest.put(
        `/users/${currentUser._id}`,
        updatedUser,
        {
          headers: { token: `Bearer ${currentUser.accessToken}` },
        }
      );
      dispatch(addNotification({ message: `User ${formValues.username} updated!`, type: "success" }));
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleMenuClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <Container>
    <Navbar/>
        <UserContainer>
            <UserTitleContainer>
            <UserTitle>Edit User</UserTitle>
            <MenuButton>
            <MenuIcon />
            <MenuContent>
              <MenuItem onClick={() => handleMenuClick("wishlist")}>Check Wishlist</MenuItem>
              <MenuItem onClick={() => handleMenuClick("orders")}>See Order History</MenuItem>
              <MenuItem onClick={() => handleMenuClick("feedback")}>Send Feedback</MenuItem>
              <MenuItem onClick={() => handleMenuClick("delete")}>Delete Profile</MenuItem>
              <MenuItem onClick={() => handleMenuClick("logout")}>Logout</MenuItem>
            </MenuContent>
            </MenuButton>
            </UserTitleContainer>
            <UserContainerWrapper>
            <UserShow>
                <UserShowTop>
                <UserShowImg
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt=""
                />
                <UserShowTopTitle>
                    <UserShowUsername>{user.username}</UserShowUsername>
                    <UserShowUserTitle>{user.jobTitle || "N/A"}</UserShowUserTitle>
                </UserShowTopTitle>
                </UserShowTop>
                <UserShowBottom>
                <UserShowTitle>Account Details</UserShowTitle>
                <UserShowInfo>
                    <UserShowIcon>
                    <PermIdentity />
                    </UserShowIcon>
                    <UserShowInfoText>{user.username}</UserShowInfoText>
                </UserShowInfo>
                <UserShowInfo>
                    <UserShowIcon>
                    <CalendarToday />
                    </UserShowIcon>
                    <UserShowInfoText>{user.birthDate || "N/A"}</UserShowInfoText>
                </UserShowInfo>
                <UserShowTitle>Contact Details</UserShowTitle>
                <UserShowInfo>
                    <UserShowIcon>
                    <PhoneAndroid />
                    </UserShowIcon>
                    <UserShowInfoText>{user.phone || "N/A"}</UserShowInfoText>
                </UserShowInfo>
                <UserShowInfo>
                    <UserShowIcon>
                    <MailLockOutlined />
                    </UserShowIcon>
                    <UserShowInfoText>{user.email}</UserShowInfoText>
                </UserShowInfo>
                <UserShowInfo>
                    <UserShowIcon>
                    <LocationSearching />
                    </UserShowIcon>
                    <UserShowInfoText>{user.address || "N/A"}</UserShowInfoText>
                </UserShowInfo>
                </UserShowBottom>
            </UserShow>
            <UserUpdate>
                <UserUpdateTitle>Edit</UserUpdateTitle>
                <UserUpdateForm onSubmit={handleFormSubmit}>
                <UserUpdateLeft>
                    <UserUpdateItem>
                    <UserUpdateLabel>Username</UserUpdateLabel>
                    <UserUpdateInput
                        type="text"
                        name="username"
                        value={formValues.username} // Current value if updated
                        onChange={handleInputChange}
                        placeholder={user.username || "Username"} // Placeholder shows current username
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Full Name</UserUpdateLabel>
                    <UserUpdateInput
                        type="text"
                        name="fullName"
                        value={formValues.fullName}
                        onChange={handleInputChange}
                        placeholder={user.fullName || "Full Name"}
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Email</UserUpdateLabel>
                    <UserUpdateInput
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        placeholder={user.email || "Email"}
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Phone</UserUpdateLabel>
                    <UserUpdateInput
                        type="text"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        placeholder={user.phone || "Phone"}
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Address</UserUpdateLabel>
                    <UserUpdateInput
                        type="text"
                        name="address"
                        value={formValues.address}
                        onChange={handleInputChange}
                        placeholder={user.address || "Address"}
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Birth Date</UserUpdateLabel>
                    <UserUpdateInput
                        type="date"
                        name="birthDate"
                        value={formValues.birthDate}
                        onChange={handleInputChange}
                        placeholder={formatDateForDisplay(user.birthDate)}
                    />
                    </UserUpdateItem>
                    <UserUpdateItem>
                    <UserUpdateLabel>Job Title</UserUpdateLabel>
                    <UserUpdateInput
                        type="text"
                        name="jobTitle"
                        value={formValues.jobTitle}
                        onChange={handleInputChange}
                        placeholder={user.jobTitle || "Job Title"}
                    />
                    </UserUpdateItem>
                </UserUpdateLeft>
                <UserUpdateRight>
                    <UserUpdateUpload>
                    <UserUpdateImg
                        src={user.avatar || "https://via.placeholder.com/150"}
                        alt=""
                    />
                    <label htmlFor="file">
                        <Publish style={{ cursor: "pointer" }} />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    </UserUpdateUpload>
                    <UserUpdateButton type="submit">Update</UserUpdateButton>
                </UserUpdateRight>
                </UserUpdateForm>
            </UserUpdate>
            <div>
                {activeComponent === "wishlist" && <Wishlist />}
                {activeComponent === "orders" && <Orders />}
                {activeComponent === "feedback" && <div>Feedback Form Here</div>}
                {activeComponent === "delete" && <div>Are you sure? (Delete functionality)</div>}
                {activeComponent === "logout" && <div>Logging out...</div>}
            </div>
            </UserContainerWrapper>
        </UserContainer>
    </Container>
  );
};

export default Profile;
*/

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  CalendarToday,
  LocationSearching,
  MailLockOutlined,
  PermIdentity,
  PhoneAndroid,
  Publish,
  Logout,
  DeleteOutline,
  FavoriteBorder,
  FeedbackOutlined,
  History,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { publicRequest, userRequest } from "../requestMethods";
import { addNotification } from "../redux/userRedux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";
import Navbar from "../Components/Navbar";
import Wishlist from "../Components/Announcement"; // Assuming you have this component
import Orders from "../Components/Whychooseus"; // Assuming you have this component

// Styled components
const Cont = styled.div``;
const Container = styled.div`
  display: flex;
  background-color: #f0f2f5;
  min-height: 100vh;
  //margin-top: 60px ;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  position: sticky;
  //top: 0;
`;

const UserContainer = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 20px; // Space for sidebar
  //margin-top: 80px auto;
`;

const UserTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin-bottom: 10px;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 10px;
    color: #4caf50; // Icon color
  }
`;

const UserContainerWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const UserShow = styled.div`
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const UserShowTop = styled.div`
  display: flex;
  align-items: center;
`;

const UserShowImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserShowUsername = styled.span`
  font-weight: 600;
  font-size: 20px;
  color: #333;
`;

const UserShowUserTitle = styled.span`
  font-size: 16px;
  color: #777;
  margin-top: 5px;
  display: block;
`;

const UserShowBottom = styled.div`
  margin-top: 20px;
`;

const UserShowTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
  display: block;
`;

const UserShowInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #555;
`;

const UserUpdate = styled.div`
  flex: 2;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const UserUpdateTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const UserUpdateForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const UserUpdateLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const UserUpdateLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
`;

const UserUpdateInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4caf50;
  }
`;

const UserUpdateRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserUpdateUpload = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const UserUpdateImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserUpdateButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [formValues, setFormValues] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    jobTitle: "",
  });

  const [activeComponent, setActiveComponent] = useState(""); 

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty or undefined date strings
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date
    return date.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
  };

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const res = await userRequest.get(`/users/find/${currentUser._id}`, {
        headers: { token: `Bearer ${currentUser.accessToken}` },
      });
      setUser(res.data);
      setFormValues({
        username: res.data.username || "",
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        birthDate: res.data.birthDate || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        jobTitle: res.data.jobTitle || "",
      });
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, currentUser.accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let updatedUser = { ...formValues };

    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Failed to upload file:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedUser = { ...updatedUser, avatar: downloadURL };
            await updateUser(updatedUser);
            await fetchUser();
          } catch (error) {
            console.error("Failed to get download URL:", error);
          }
        }
      );
    } else {
      await updateUser(updatedUser);
      await fetchUser();
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await userRequest.put(`/users/${currentUser._id}`, updatedUser, {
        headers: { token: `Bearer ${currentUser.accessToken}` },
      });
      dispatch(addNotification("User updated successfully"));
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };
  const isAnnouncementVisible = false;

  return (
  <Cont>  
    <Navbar showNavbar={isAnnouncementVisible} hasAnnouncement={isAnnouncementVisible}/>
    <Container>
      <Sidebar>
        <UserTitle>User Menu</UserTitle>
        <MenuItem onClick={() => setActiveComponent("details")}>
          <PermIdentity /> Profile Details
        </MenuItem>
        <MenuItem onClick={() => setActiveComponent("wishlist")}>
          <FavoriteBorder /> Wishlist
        </MenuItem>
        <MenuItem onClick={() => setActiveComponent("orders")}>
          <History /> Order History
        </MenuItem>
        <MenuItem onClick={() => setActiveComponent("feedback")}>
          <FeedbackOutlined /> Feedback
        </MenuItem>
        <MenuItem onClick={() => console.log("Logging out...")}>
          <Logout /> Logout
        </MenuItem>
        <MenuItem onClick={() => console.log("Deleting profile...")}>
          <DeleteOutline /> Delete Profile
        </MenuItem>
      </Sidebar>
      <UserContainer>
        {activeComponent === "details" && (
          <UserContainerWrapper>
            <UserShow>
              <UserShowTop>
                <UserShowImg src={user.avatar || "https://i.ibb.co/S6yQfSN/no-avatar.png"} />
                <div>
                  <UserShowUsername>{user.username || "N/A"}</UserShowUsername>
                  <UserShowUserTitle>{user.fullName || "N/A"}</UserShowUserTitle>
                </div>
              </UserShowTop>
              <UserShowBottom>
                <UserShowTitle>Account Details</UserShowTitle>
                <UserShowInfo>
                  <CalendarToday style={{ color: "gray" }} />
                  {formatDateForDisplay(user.birthDate)} 
                </UserShowInfo>
                <UserShowInfo>
                  <LocationSearching style={{ color: "gray" }} />
                  {user.address || "N/A"}
                </UserShowInfo>
                <UserShowInfo>
                  <PhoneAndroid style={{ color: "gray" }} />
                  {user.phone || "N/A"}
                </UserShowInfo>
                <UserShowInfo>
                  <MailLockOutlined style={{ color: "gray" }} />
                  {user.email || "N/A"}
                </UserShowInfo>
                <UserShowInfo>
                  <span style={{ fontWeight: "600", marginRight: "5px" }}>Job Title:</span>
                  {user.jobTitle || "N/A"}
                </UserShowInfo>
              </UserShowBottom>
            </UserShow>
            <UserUpdate>
              <UserUpdateTitle>Edit Profile</UserUpdateTitle>
              <UserUpdateForm onSubmit={handleFormSubmit}>
                <UserUpdateLeft>
                  {Object.keys(formValues).map((key) => (
                    <UserUpdateItem key={key}>
                      <UserUpdateLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</UserUpdateLabel>
                      <UserUpdateInput
                        type="text"
                        name={key}
                        value={formValues[key]}
                        onChange={handleInputChange}
                      />
                    </UserUpdateItem>
                  ))}
                </UserUpdateLeft>
                <UserUpdateRight>
                  <UserUpdateUpload>
                    <UserUpdateImg src={file ? URL.createObjectURL(file) : user.avatar} />
                    <label htmlFor="file">
                      <Publish style={{ cursor: "pointer", color: "#4caf50" }} />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </UserUpdateUpload>
                  <UserUpdateButton type="submit">Update</UserUpdateButton>
                </UserUpdateRight>
              </UserUpdateForm>
            </UserUpdate>
          </UserContainerWrapper>
        )}
        {activeComponent === "wishlist" && <Wishlist />}
        {activeComponent === "orders" && <Orders />}
        {activeComponent === "feedback" && <div>Feedback Section</div>}
      </UserContainer>
    </Container>
  </Cont>
  );
};

export default Profile;
