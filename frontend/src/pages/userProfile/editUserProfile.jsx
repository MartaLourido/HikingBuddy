import React, { useEffect, useState } from "react";
import ImgUpload from "./ImgUpload";
import UserApi from "../../api/UserApi";
import { Button, Form } from "semantic-ui-react";

export default function EditUserProfile({ currentUser, setToggler, setUser }) {
  const [userForm, setUserForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio,
    imageUrl: currentUser.imageUrl,
  });

  const change = ({ target: { name, value } }) => {
    setUserForm({ ...userForm, [name]: value });
    console.log("here", userForm);
  };

  const updateUser = async () => {
    try {
      await UserApi.updateUser(userForm).then((response) => {
        setUser(response.data);
      });
    } catch (err) {
      console.error(err);
    }
    // getcurrentUser().then((responce) => setUserForm(responce));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser();
    setToggler(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await UserApi.getUser();
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  //save button confirmation alert

  return (
    <div className="profile">
      <Form onSubmit={handleSubmit}>
        <div>
          <img className="img" src={userForm.imageUrl} alt="" /> <br />
          <ImgUpload className="profile" uploadImg={change} />
          <label htmlFor="name-input">Name:</label>
          <input
            disabled
            type="text"
            id="name-input"
            name="name"
            value={userForm.name}
            onChange={change}
          />
        </div>
        <div>
          <label htmlFor="email-input">Email:</label>
          <input
            type="text"
            id="email-input"
            name="email"
            value={userForm.email}
            onChange={change}
          />
        </div>
        <div>
          <label htmlFor="bio-input">Bio:</label>
          <textarea
            type="text"
            id="bio-input"
            name="bio"
            onChange={change}
            value={userForm.bio}
            rows="6"
            cols="80"
            id="TITLE"
          ></textarea>
        </div>
        <Button type="submit">Save Changes</Button>
      </Form>
    </div>
  );
}
