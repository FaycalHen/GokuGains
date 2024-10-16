import {
  CalendarToday,
  LocationSearching,
  MailLockOutlined,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@mui/icons-material";
import "./user.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector ,useDispatch} from "react-redux";
import { userRequest } from "../../requestMethods";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addNotification } from "../../redux/userRedux";
const User = () => {
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
  });

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const res = await userRequest.get(`/users/find/${userId}`, {
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

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty or undefined date strings
  
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date
    
    return date.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
  };
  
  // Use useEffect to fetch user data on component mount
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
            // Re-fetch user data to reflect changes
            await fetchUser();
          } catch (error) {
            console.error("Failed to get download URL:", error);
          }
        }
      );
    } else {
      await updateUser(updatedUser);
      // Re-fetch user data to reflect changes
      await fetchUser();
    }
  };

  const updateUser = async (updatedUser) => {
    console.log("Updating user with data:", updatedUser); // Log the user data
    try {
      const response = await userRequest.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedUser,
        {
          headers: { token: `Bearer ${currentUser.accessToken}` },
        }
      );
      console.log("Update response:", response.data); // Log the response data
      dispatch(addNotification({ message: "user "+formValues.username+"updated !", type: "success" }));
      // Optionally handle success feedback here
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.username}</span>
              <span className="userShowUserTitle">
                {user.jobTitle || "N/A"}
              </span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user.username}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">
                {formatDateForDisplay(user.birthDate) || "N/A"}
              </span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{user.phone || "N/A"}</span>
            </div>
            <div className="userShowInfo">
              <MailLockOutlined className="userShowIcon" />
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">
                {user.address || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleFormSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  placeholder={user.username}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleInputChange}
                  placeholder={user.fullName || "N/A"}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder={user.email}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formValues.birthDate}
                  onChange={handleInputChange}
                  placeholder={formatDateForDisplay(user.birthDate)}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formValues.jobTitle}
                  onChange={handleInputChange}
                  placeholder={user.jobTitle || "N/A"}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  placeholder={user.phone || "N/A"}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleInputChange}
                  placeholder={user.address || "N/A"}
                  className="userUpdateInput"
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={user.avatar || "https://via.placeholder.com/150"}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="userUpdateButton" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
