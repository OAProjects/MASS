import { useState, useEffect } from "react";
import AuthService from "../../services/auth";
import axios from "axios";

const genders = ["male", "female", "other"];
const specialisations = [
  "Addiction Therapist",
  "Family Therapy",
  "Psychodynamic psychotherapy",
  "Cognitive Behavioural Therapy",
];

const ProfileForm = () => {
  const [user, setUser] = useState(AuthService.getUser());
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    specialisation: "",
  });

  const [isProfileCreated, setIsProfileCreated] = useState(false);

  useEffect(() => {
    AuthService.fetchUserDetails().then((response) => {
      const userData = response.data;
      setUser(userData);
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        date_of_birth: userData.date_of_birth || "",
        gender: userData.gender || "",
        specialisation: userData.specialisation || "",
      });
      setIsProfileCreated(!!userData.first_name); // Check if the profile is already created
      console.log("User data:", userData); // Log user data
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData); // Log the form data
    try {
      if (user.role === "Patient") {
        const url = isProfileCreated
          ? `http://localhost:3000/patients/${user.user_id}/profile`
          : `http://localhost:3000/patients/profile`;
        const method = isProfileCreated ? "put" : "post";

        const response = await axios[method](url, formData, {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        });
        alert(response.data.message);
      } else if (user.role === "Doctor") {
        const url = isProfileCreated
          ? `http://localhost:3000/doctors/${user.user_id}/profile`
          : `http://localhost:3000/doctors/profile`;
        const method = isProfileCreated ? "put" : "post";

        const response = await axios[method](url, formData, {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        });
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>
      {user.role === "Doctor" && (
        <div>
          <label>Specialisation</label>
          <select
            name="specialisation"
            value={formData.specialisation}
            onChange={handleChange}
            required
          >
            <option value="">Select specialisation</option>
            {specialisations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}
      <button type="submit">
        {isProfileCreated ? "Update Profile" : "Create Profile"}
      </button>
    </form>
  );
};

export default ProfileForm;
