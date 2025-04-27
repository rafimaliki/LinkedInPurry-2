import React, { useState } from "react";

interface EditProfileDialogProps {
  profileData: any;
  onClose: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  profileData,
  onClose,
}) => {
  const [formData, setFormData] = useState(profileData);
  console.log(profileData);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: typeof profileData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("full_name", formData.full_name);
      data.append("work_history", formData.work_history);
      data.append("skills", formData.skills);
      if (profilePhoto) {
        data.append("profile_photo", profilePhoto);
      }

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      const response = await fetch(
        `http://localhost:3000/api/profile/${formData.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        onClose();
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to update profile: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full h-[65%] bg-white p-6 rounded-lg shadow-lg lg:w-[80%] lg:h-[80%] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Work History</label>
            <textarea
              name="work_history"
              value={formData.work_history}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Photo</label>
            <input
              type="file"
              name="profile_photo"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileDialog;
