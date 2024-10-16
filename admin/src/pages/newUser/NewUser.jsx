import "./newUser.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/apiCalls";
import { addNotification } from "../../redux/userRedux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

const NewUser = () => {
  const [inputs, setInputs] = useState({});
  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [file, setFile] = useState(null);
  const [active, setActive] = useState("yes");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBirthDateChange = (e) => {
    setBirthDate(e.target.value);
  };

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleActiveChange = (e) => {
    setActive(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let avatarURL = "";
  
    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Failed to upload file:", error);
            reject(error);
          },
          async () => {
            try {
              avatarURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            } catch (error) {
              console.error("Failed to get download URL:", error);
              reject(error);
            }
          }
        );
      });
    }
  
    const user = {
      ...inputs,
      birthDate,
      avatar: avatarURL || avatar,
      jobTitle,
      isAdmin: false,
      active: active === "yes",
    };
  
    console.log("Sending user data:", user); // Log user data being sent
  
    try {
      await addUser(user, dispatch);
      dispatch(addNotification({ message: "New user registered", type: "success" }));
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };
  


  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Username</label>
          <input name="username" type="text" placeholder="username" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Full Name</label>
          <input name="fullName" type="text" placeholder="John Smith" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input name="email" type="email" placeholder="john@gmail.com" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input name="password" type="password" placeholder="password" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Phone</label>
          <input name="phone" type="text" placeholder="+1 123 456 78" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Address</label>
          <input name="address" type="text" placeholder="New York | USA" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Birth Date</label>
          <input type="date" name="birthDate" value={birthDate} onChange={handleBirthDateChange} />
        </div>
        <div className="newUserItem">
          <label>Job Title</label>
          <input name="jobTitle" type="text" placeholder="Job Title" value={jobTitle} onChange={handleJobTitleChange} />
        </div>
        <div className="newUserItem">
          <label>Avatar</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="newUserItem">
          <label>Active</label>
          <select className="newUserSelect" name="active" onChange={handleActiveChange}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <button className="newUserButton" onClick={handleClick}>Create</button>
      </form>
    </div>
  );
};

export default NewUser;
