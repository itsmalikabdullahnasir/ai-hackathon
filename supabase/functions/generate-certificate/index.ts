// Edge Function: generate-certificate
// POST /functions/v1/generate-certificate
// Validates course completion, generates PDF cert, uploads to Storage

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateCertificateHTML(params: {
  studentName: string
  courseName: string
  instructorName: string
  issueDate: string
  verificationCode: string
  level: string
}): string {
  const { studentName, courseName, instructorName, issueDate, verificationCode, level } = params
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1122px; height: 794px; background: #fff; font-family: 'DM Sans', sans-serif; overflow: hidden; }
    .cert { width: 100%; height: 100%; border: 8px solid #E8521A; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 700; color: #0F172A; }
    .logo span { color: #E8521A; }
    .badge { background: #E8521A; color: white; padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .body { text-align: center; padding: 0 40px; }
    .label { font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; color: #64748B; margin-bottom: 16px; }
    .name { font-family: 'Sora', sans-serif; font-size: 52px; font-weight: 700; color: #0F172A; margin-bottom: 16px; border-bottom: 3px solid #E8521A; padding-bottom: 16px; display: inline-block; }
    .course-label { font-size: 14px; color: #64748B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; }
    .course { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 600; color: #E8521A; margin-bottom: 8px; }
    .level { font-size: 16px; color: #64748B; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; }
    .sig { text-align: center; }
    .sig-line { width: 180px; border-top: 2px solid #0F172A; margin: 0 auto 8px; }
    .sig-name { font-weight: 600; font-size: 14px; color: #0F172A; }
    .sig-title { font-size: 12px; color: #64748B; }
    .verify { text-align: right; }
    .verify-label { font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
    .verify-code { font-family: monospace; font-size: 13px; color: #64748B; margin-top: 4px; }
    .date { font-size: 13px; color: #64748B; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="header">
      <div class="logo">atom<span>learn</span> <span style="font-size:14px;color:#64748B;font-weight:400">by atomcamp</span></div>
      <div class="badge">Certificate of Completion</div>
    </div>
    <div class="body">
      <div class="label">This certifies that</div>
      <div class="name">${studentName}</div>
      <div class="course-label" style="margin-top:24px">has successfully completed</div>
      <div class="course">${courseName}</div>
      <div class="level">${level} Level · atomcamp Pakistan</div>
    </div>
    <div class="footer">
      <div>
        <div class="date">Issued: ${issueDate}</div>
      </div>
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-name">${instructorName}</div>
        <div class="sig-title">Lead Instructor, atomcamp</div>
      </div>
      <div class="verify">
        <div class="verify-label">Verification Code</div>
        <div class="verify-code">${verificationCode}</div>
        <div class="verify-label" style="margin-top:4px">verify.atomcamp.com</div>
      </div>
    </div>
  </div>
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { student_id, course_id } = await req.json()

    // Validate: check if all modules are completed
    const { data: courseModules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', course_id)

    const { data: completedModules } = await supabase
      .from('module_progress')
      .select('module_id')
      .eq('student_id', student_id)
      .eq('completed', true)
      .in('module_id', (courseModules ?? []).map((m) => m.id))

    const totalModules = courseModules?.length ?? 0
    const doneCount = completedModules?.length ?? 0

    if (doneCount < totalModules) {
      return new Response(
        JSON.stringify({ error: `Course not complete. ${doneCount}/${totalModules} modules done.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Check if cert already exists
    const { data: existing } = await supabase
      .from('certificates')
      .select('pdf_url, verification_code')
      .eq('student_id', student_id)
      .eq('course_id', course_id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ pdf_url: existing.pdf_url, verification_code: existing.verification_code }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Fetch names
    const [studentRes, courseRes] = await Promise.all([
      supabase.from('profiles').select('full_name, level').eq('id', student_id).single(),
      supabase.from('courses').select('title, instructor_id').eq('id', course_id).single(),
    ])

    const { data: instructor } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', courseRes.data?.instructor_id)
      .single()

    const verificationCode = `AC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const issueDate = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })

    const html = generateCertificateHTML({
      studentName: studentRes.data?.full_name ?? 'Student',
      courseName: courseRes.data?.title ?? 'Course',
      instructorName: instructor?.full_name ?? 'atomcamp Instructor',
      issueDate,
      verificationCode,
      level: studentRes.data?.level ?? 'intermediate',
    })

    // Upload HTML as certificate (in production, use Puppeteer/headless Chrome for PDF)
    const blob = new Blob([html], { type: 'text/html' })
    const fileName = `${student_id}/${course_id}/certificate.html`

    const { data: upload, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, blob, { upsert: true, contentType: 'text/html' })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName)

    // Insert certificate record
    await supabase.from('certificates').insert({
      student_id,
      course_id,
      pdf_url: urlData.publicUrl,
      verification_code: verificationCode,
    })

    return new Response(
      JSON.stringify({ pdf_url: urlData.publicUrl, verification_code: verificationCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
