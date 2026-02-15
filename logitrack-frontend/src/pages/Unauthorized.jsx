import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-6">Unauthorized Access</h2>
            <p className="text-gray-600 mb-8 text-center px-4">
                You do not have the permissions required to view this page.
            </p>
            <button
                onClick={() => navigate(-1)} // Takes them back to where they came from
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                Go Back
            </button>
        </div>
    );
};

export default Unauthorized;