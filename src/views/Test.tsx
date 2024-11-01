import React, { useState, useEffect } from "react";
import axios from "axios";

interface Test {
  testId: number;
  description: string;
  active: boolean;
}

const Test: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("https://localhost:7102/api/Test");
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Test Data</h2>
      <ul className="space-y-2">
        {tests.map((test) => (
          <li key={test.testId} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">ID: {test.testId}</p>
            <p>Description: {test.description}</p>
            <p>Active: {test.active ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
