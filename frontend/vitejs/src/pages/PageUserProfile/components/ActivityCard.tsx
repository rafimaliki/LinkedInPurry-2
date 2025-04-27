interface ActivityCardProps {
    id: number;
    content: string;
    created_at: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ content, created_at }) => {
    return (
        <div className="w-full bg-white p-6">
            <p className="text-gray-600">{content}</p>
            <p className="text-gray-400 mt-2">{new Date(created_at).toLocaleDateString()}</p>
        </div>
    );
};

export default ActivityCard;