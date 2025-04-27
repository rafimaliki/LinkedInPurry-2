interface SkillCardProps {
    skills: string[];
}

const SkillCard: React.FC<SkillCardProps> = ({ skills }) => {
    return (
        <div className="w-full bg-white p-6">
            <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">{skill}</span>
                ))}
            </div>
        </div>
    );
};

export default SkillCard;