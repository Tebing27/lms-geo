import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { emails } = await request.json();

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json(
      { error: 'Daftar email tidak valid atau kosong.' },
      { status: 400 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const invitationResults = [];

  for (const email of emails) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
      console.error(`Gagal mengundang ${email}:`, error.message);
      invitationResults.push({ email, success: false, error: error.message });
    } else {
      invitationResults.push({ email, success: true, data });
    }
  }
  
  return NextResponse.json({
    message: 'Proses undangan selesai.',
    results: invitationResults,
  });
}