import React from 'react';

const features = [
  "Create expense groups ",
  "Add friends",
  "Split expenses, record debts",
  "Equal or unequal splits",
  "Get Summary of Debts",
  "Calculate total balances",
  "Simplify debts",
  "Recurring expenses",
  "Settle up made easy",
  "Cloud Sync",
  "Spending totals",
  "Admin controls",
];

const About = () => {
  return (
    <div id='about'className="bg-black text-white p-6">
      <h2 className="text-4xl font-bold mb-4 text-center">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.slice(0, 12).map((feature, index) => (
          <div key={index} className="bg-gray-950 p-4 rounded shadow">
            {feature}
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
