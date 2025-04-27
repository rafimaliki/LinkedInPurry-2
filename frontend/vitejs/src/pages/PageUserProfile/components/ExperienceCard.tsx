interface ExperienceCardProps {
  jobs: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ jobs }) => {
  return (
    <>
      {jobs.map((job, index) => (
        <div key={index}>
          <div className="w-full bg-white p-6">
            <h2 key={index} className="text-l font-bold mb-4">
              {job}
            </h2>
          </div>
          <div className="w-[95%] mb-2 border-b border-neutral-300 justify-self-center"></div>
        </div>
      ))}
    </>
  );
};

export default ExperienceCard;
