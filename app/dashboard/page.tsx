'use client'; // This page now needs to be a client component to handle button clicks

import { createClient } from '@/app/lib/supabase/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define the shape of our plan data
type Plan = {
  id: number;
  created_at: string;
  appName: string;
  description: string;
};

// This is the new, interactive part of the page
export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getPlans = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return redirect('/login');
      }

      const { data, error } = await supabase
        .from('plans')
        .select('id, created_at, appName, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setPlans(data);
      }
      setLoading(false);
    };
    getPlans();
  }, [supabase]);

  const handleDelete = async (planId: number) => {
    // Optimistically remove the plan from the UI
    setPlans(plans.filter((plan) => plan.id !== planId));

    const response = await fetch('/api/delete-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      // If the delete fails, show an alert and re-fetch the data to revert the UI
      alert('Failed to delete plan. Please try again.');
      // Re-fetch logic would go here
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading your plans...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Saved Plans</h1>
      {plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{plan.appName}</h2>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <p className="text-xs text-gray-500">
                  Created on: {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(plan.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-gray-800 rounded-lg border border-gray-700">
          <p className="mb-4">You haven't saved any plans yet.</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
            Create Your First Plan
          </Link>
        </div>
      )}
    </div>
  );
}