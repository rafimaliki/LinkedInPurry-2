import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./components/ProfileCard";
import ActivityCard from "./components/ActivityCard";
import ExperienceCard from "./components/ExperienceCard";
import SkillCard from "./components/SkillCard";
import RecommendationCard from "./components/RecommendationCard";
import EditProfileDialog from "./components/EditProfileDialog";

const PageUserProfile: React.FC = () => {
  const { user_id } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/profile/${user_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [user_id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const skillArray = profileData.body.skills
    ? profileData.body.skills.split(",")
    : [];
  const jobArray = profileData.body.work_history
    ? profileData.body.work_history.split(",")
    : [];

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-y-auto py-5">
      <div className="w-full flex flex-col lg:flex-row gap-6 justify-center">
        <div className="w-full lg:w-[65%] flex flex-col gap-y-2">
          <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
            <ProfileCard
              id={profileData.body.id}
              username={profileData.body.username}
              full_name={profileData.body.full_name}
              email={profileData.body.email}
              profile_photo={profileData.body.profile_photo}
              connection_count={profileData.body.connection_count}
              isOwnProfile={profileData.body.isOwnProfile}
              isConnected={profileData.body.isConnected}
              isAuthenticated={profileData.body.isAuthenticated}
              onEditProfile={handleEditProfile}
            />
          </div>
          {!profileData.body.isOwnProfile && (
            <>
              <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                <h1 className="text-2xl font-bold ml-6 mt-6">Experience</h1>
                {profileData.body.work_history?.length > 0 ? (
                  <ExperienceCard jobs={jobArray} />
                ) : (
                  <p className="text-gray-600 ml-6 my-6">
                    {profileData.body.username} haven’t added any experiences
                    yet
                  </p>
                )}
              </div>
              <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                <h1 className="text-2xl font-bold ml-6 mt-6">Skills</h1>
                {profileData.body.skills?.length > 0 ? (
                  <SkillCard skills={skillArray} />
                ) : (
                  <p className="text-gray-600 ml-6 my-6">
                    {profileData.body.username} haven’t added any skills yet
                  </p>
                )}
              </div>
              {profileData.body.isAuthenticated && (
                <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                  <h1 className="text-2xl font-bold ml-6 mt-6">Activity</h1>
                  {profileData.body.relevant_posts?.length > 0 ? (
                    profileData.body.relevant_posts.map((activity: any) => (
                      <div key={activity.id}>
                        <ActivityCard {...activity} />
                        <div className="w-[48rem] mb-2 border-b border-neutral-300 justify-self-center"></div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 ml-6 my-6">
                      {profileData.username} haven’t posted yet
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          {profileData.body.isOwnProfile && (
            <>
              <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                <h1 className="text-2xl font-bold ml-6 mt-6">Experience</h1>
                {profileData.body.work_history?.length > 0 ? (
                  <ExperienceCard jobs={jobArray} />
                ) : (
                  <p className="text-gray-600 ml-6 my-6">
                    You haven’t added any experiences yet
                  </p>
                )}
              </div>
              <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                <h1 className="text-2xl font-bold ml-6 mt-6">Skills</h1>
                {profileData.body.skills?.length > 0 ? (
                  <SkillCard skills={skillArray} />
                ) : (
                  <p className="text-gray-600 ml-6 my-6">
                    You haven’t added any skills yet
                  </p>
                )}
              </div>
              <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
                <h1 className="text-2xl font-bold ml-6 mt-6">Activity</h1>
                {profileData.body.relevant_posts?.length > 0 ? (
                  profileData.body.relevant_posts.map((activity: any) => (
                    <div key={activity.id}>
                      <ActivityCard {...activity} />
                      <div className="w-[48rem] mb-2 border-b border-neutral-300 justify-self-center"></div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 ml-6 my-6">
                    You haven’t posted yet
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-full lg:w-[22%]">
          <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
            <h1 className="text-l font-bold ml-6 mt-6">
              More profiles for you
            </h1>
            {profileData.body.recommendations?.map((recommendation: any) => (
              <div key={recommendation.id}>
                <RecommendationCard
                  {...recommendation}
                  isAuthenticated={profileData.body.isAuthenticated}
                />
                <div className="w-[85%] mb-2 border-b border-neutral-300 justify-self-center"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isEditDialogOpen && (
        <EditProfileDialog
          profileData={{ ...profileData.body, id: user_id }}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default PageUserProfile;
