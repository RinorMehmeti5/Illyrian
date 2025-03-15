import React, { useState, useEffect } from "react";
import axios from "axios";

interface Test {
  testId: number;
  description: string;
  active: boolean;
}

const Test: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7102/api/Test");
        setTests(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching tests:", error);
        setError("Failed to load test data");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Test Data</h2>
      {tests.length === 0 ? (
        <p className="text-gray-500">No test data available.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <li
              key={test.testId}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <p className="font-semibold text-lg">ID: {test.testId}</p>
              <p className="text-gray-700">Description: {test.description}</p>
              <p className="text-gray-700">
                Status:
                <span
                  className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    test.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {test.active ? "Active" : "Inactive"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Test;
