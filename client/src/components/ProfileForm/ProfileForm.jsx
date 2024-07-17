import { useState, useEffect } from "react";
import AuthService from "../../services/auth";
import axios from "axios";
import styles from "./ProfileForm.module.css";

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
      console.log("User data:", userData); // Log user data
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData); // Log the form data
    try {
      if (user.role === "Patient") {
        const response = await axios.post(
          "http://localhost:3000/patients/profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${AuthService.getToken()}`,
            },
          }
        );
        alert(response.data.message);
      } else if (user.role === "Doctor") {
        const response = await axios.post(
          "http://localhost:3000/doctors/profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${AuthService.getToken()}`,
            },
          }
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log("Update form submitted:", formData); // Log the form data
    try {
      if (user.role === "Patient") {
        const response = await axios.put(
          `http://localhost:3000/patients/${user.user_id}/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${AuthService.getToken()}`,
            },
          }
        );
        alert(response.data.message);
      } else if (user.role === "Doctor") {
        const response = await axios.put(
          `http://localhost:3000/doctors/${user.user_id}/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${AuthService.getToken()}`,
            },
          }
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div
      className={`w-11/12 max-w-[700px] px-10 py-20 rounded-3xl border-2 border-gray-100 shadow-2xl mt-12 ml-4 ${styles.main_container}`}
    >
      <h2 className="text-3xl font-semibold">Profile</h2>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Please complete your profile.
      </p>
      <form className="mt-8">
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium" htmlFor="first_name">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium" htmlFor="last_name">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium" htmlFor="date_of_birth">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium" htmlFor="gender">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
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
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium" htmlFor="specialisation">
              Specialisation
            </label>
            <select
              name="specialisation"
              value={formData.specialisation}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
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
        <div className="flex justify-between mt-8">
          <button
            type="submit"
            onClick={handleProfileSubmit}
            className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
          >
            Create Profile
          </button>
          <button
            type="submit"
            onClick={handleProfileUpdate}
            className="ml-4 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-blue-500 rounded-xl text-white font-bold text-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
