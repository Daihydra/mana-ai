import { createClient } from '@/app/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return new Response(JSON.stringify({ error: 'Plan ID is required' }), { status: 400 });
    }

    // Delete the plan, but only if the user_id matches the logged-in user's id.
    // This is a double layer of security on top of our RLS policy.
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error('Error deleting plan:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}