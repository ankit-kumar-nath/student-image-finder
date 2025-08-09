import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StudentData {
  [key: string]: any;
}

interface RequestBody {
  students: StudentData[];
  sourceFileName: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { students, sourceFileName }: RequestBody = await req.json();

    console.log(`Processing ${students.length} student records from ${sourceFileName}`);

    // Prepare data for insertion
    const studentsToInsert = students.map((student) => {
      // Extract common fields with flexible column name matching
      const rollNumber = student['Roll Number'] || student['RollNumber'] || student['roll_number'] || 
                        student['Roll_Number'] || student['ROLL_NUMBER'] || student['Roll No'] ||
                        student['RollNo'] || student['roll_no'] || '';

      const name = student['Name'] || student['name'] || student['NAME'] || 
                  student['Student Name'] || student['StudentName'] || student['student_name'] || '';

      const course = student['Course'] || student['course'] || student['COURSE'] || 
                    student['Program'] || student['program'] || student['PROGRAM'] || '';

      const department = student['Department'] || student['department'] || student['DEPARTMENT'] || 
                        student['Dept'] || student['dept'] || student['DEPT'] || '';

      const year = student['Year'] || student['year'] || student['YEAR'] || 
                  student['Admission Year'] || student['AdmissionYear'] || student['admission_year'] || '';

      // Store all other fields in additional_info
      const additionalInfo: { [key: string]: any } = {};
      Object.keys(student).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!['roll number', 'rollnumber', 'roll_number', 'roll_number', 'roll_number', 'roll no', 'rollno', 'roll_no',
              'name', 'student name', 'studentname', 'student_name',
              'course', 'program',
              'department', 'dept',
              'year', 'admission year', 'admissionyear', 'admission_year'].includes(lowerKey.replace(/\s+/g, ''))) {
          additionalInfo[key] = student[key];
        }
      });

      return {
        roll_number: rollNumber,
        name: name || null,
        course: course || null,
        department: department || null,
        year: year ? String(year) : null,
        source_file_name: sourceFileName,
        additional_info: Object.keys(additionalInfo).length > 0 ? additionalInfo : null
      };
    }).filter(student => student.roll_number); // Only include records with roll numbers

    if (studentsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid student records found with roll numbers' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Inserting ${studentsToInsert.length} valid student records`);

    // Insert data into the database (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('student_data')
      .upsert(studentsToInsert, { 
        onConflict: 'roll_number',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to insert student data', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully processed ${studentsToInsert.length} student records`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: studentsToInsert.length,
        message: `Successfully uploaded ${studentsToInsert.length} student records`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});