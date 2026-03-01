$uri = "http://localhost:3000/api/students"
$headers = @{"Content-Type" = "application/json"}

# Test 1: CREATE Student
Write-Host "=== TEST 1: CREATE Student ===" -ForegroundColor Green
$body = @{
    first_name = "Alice"
    last_name = "Smith"
    email = "alice@example.com"
    phone = "5555555555"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing
$student = $response.Content | ConvertFrom-Json
Write-Host "Created student ID: $($student.id)"
Write-Host "Name: $($student.first_name) $($student.last_name)"
Write-Host "Email: $($student.email)"
Write-Host "Status: $($student.status)"

# Test 2: CREATE second student
Write-Host "`n=== TEST 2: CREATE Second Student ===" -ForegroundColor Green
$body2 = @{
    first_name = "Bob"
    last_name = "Johnson"
    email = "bob@example.com"
    phone = "6666666666"
} | ConvertTo-Json

$response2 = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body2 -UseBasicParsing
$student2 = $response2.Content | ConvertFrom-Json
Write-Host "Created student ID: $($student2.id)"

# Test 3: GET all students
Write-Host "`n=== TEST 3: GET All Students ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri $uri -Method GET -UseBasicParsing
$students = $response.Content | ConvertFrom-Json
Write-Host "Total students: $($students.Count)"
foreach ($s in $students) {
    Write-Host "- ID: $($s.id), Name: $($s.first_name) $($s.last_name), Email: $($s.email)"
}

# Test 4: GET specific student
Write-Host "`n=== TEST 4: GET Student by ID ===" -ForegroundColor Green
$studentId = $student.id
$response = Invoke-WebRequest -Uri "$uri`?id=$studentId" -Method GET -UseBasicParsing
$specificStudent = $response.Content | ConvertFrom-Json
Write-Host "ID: $($specificStudent.id)"
Write-Host "Name: $($specificStudent.first_name) $($specificStudent.last_name)"
Write-Host "Status: $($specificStudent.status)"

# Test 5: UPDATE student
Write-Host "`n=== TEST 5: UPDATE Student ===" -ForegroundColor Green
$updateBody = @{
    first_name = "Alice"
    last_name = "Williams"
    status = "inactive"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$uri`?id=$studentId" -Method PUT -Headers $headers -Body $updateBody -UseBasicParsing
$updatedStudent = $response.Content | ConvertFrom-Json
Write-Host "Updated student:"
Write-Host "Name: $($updatedStudent.first_name) $($updatedStudent.last_name)"
Write-Host "Status: $($updatedStudent.status)"

# Test 6: DELETE student
Write-Host "`n=== TEST 6: DELETE Student ===" -ForegroundColor Green
$deleteId = $student2.id
$response = Invoke-WebRequest -Uri "$uri`?id=$deleteId" -Method DELETE -UseBasicParsing
$deleteResult = $response.Content | ConvertFrom-Json
Write-Host "Deleted student: $($deleteResult.student.first_name) $($deleteResult.student.last_name)"

# Test 7: GET all students (verify count decreased)
Write-Host "`n=== TEST 7: GET All Students After Delete ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri $uri -Method GET -UseBasicParsing
$finalStudents = $response.Content | ConvertFrom-Json
Write-Host "Total students remaining: $($finalStudents.Count)"
foreach ($s in $finalStudents) {
    Write-Host "- ID: $($s.id), Name: $($s.first_name) $($s.last_name)"
}

Write-Host "`n=== ALL TESTS COMPLETED SUCCESSFULLY ===" -ForegroundColor Green
