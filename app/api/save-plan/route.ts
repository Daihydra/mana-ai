import { createClient } from '@/app/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // First, get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'You must be logged in to save a plan.' }), { status: 401 });
    }

    const plan = await request.json();

    // Insert the plan data into the 'plans' table, including the user's ID
    const { data, error } = await supabase
      .from('plans')
      .insert([
        { 
          user_id: user.id, // Add the user's ID here
          appName: plan.appName,
          description: plan.description,
          dataModels: plan.dataModels,
          pages: plan.pages,
        },
      ])
      .select();

    if (error) { throw error; }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });

  } catch (error: any) {
    console.error('Error saving plan:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}