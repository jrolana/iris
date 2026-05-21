import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/../utils/supabase/admin'; // Adjust path if needed


// const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? ''; // use this if allowed origin is defined in environment variables
const allowedOrigin = '*'; // allow all origins for the sake of demonstration

// CORS headers to allow external access
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allowed HTTP methods
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Vary': 'Origin',
};

// OPTIONS handler for the browser's preflight check
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
  const authHeader = request.headers.get('Authorization');

  // Make sure that the Authorization header is present and starts with 'Bearer '
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid authorization header' }, 
      { status: 401, headers: corsHeaders }
    );
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  // Validate the token against the database
  const { data: tokenData, error: tokenError } = await supabase.schema("private")
    .from('api_tokens')
    .select('id')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid API Token' }, 
      { status: 401, headers: corsHeaders }
    );
  }
  
  // Fetch users from the database if the token is valid
  const { data: users, error: usersError } = await supabase
    .schema("private")
    .from('users')
    .select('id, full_name, role, college_code, other_college_name, external_institution, is_active');

  if (usersError) throw usersError;

  return NextResponse.json(
    { message: 'Authentication successful', data: users }, 
    { status: 200, headers: corsHeaders }
  );

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + (error instanceof Error ? `: ${error.message}` : '') }, 
      { status: 500, headers: corsHeaders }
    );
  }
}
