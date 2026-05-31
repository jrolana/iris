import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/../utils/supabase/admin'; // Adjust path if needed

const normalizedAllowedOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.APP_URL ??
  ''
).replace(/\/$/, '');

function buildCorsHeaders(origin: string | null) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  });

  if (origin && normalizedAllowedOrigin && origin.replace(/\/$/, '') === normalizedAllowedOrigin) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  return headers;
}

// OPTIONS handler for the browser's preflight check
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('Origin');
  const headers = buildCorsHeaders(origin);

  if (origin && !headers.has('Access-Control-Allow-Origin')) {
    return new NextResponse(null, { status: 403, headers });
  }

  return new NextResponse(null, { status: 204, headers });
}

export async function GET(request: Request) {
  const origin = request.headers.get('Origin');
  const corsHeaders = buildCorsHeaders(origin);

  if (origin && !corsHeaders.has('Access-Control-Allow-Origin')) {
    return NextResponse.json(
      { error: 'CORS origin not allowed' },
      { status: 403, headers: corsHeaders }
    );
  }

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
