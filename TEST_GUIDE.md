# POST-DEPLOYMENT TESTS

## Local Testing (Before Deployment)

### 1. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Run PowerShell Test Suite
```bash
PowerShell -ExecutionPolicy Bypass -File test-apis.ps1
```

This will test:
- ✅ CREATE Student (POST)
- ✅ GET All Students (GET)
- ✅ GET Specific Student (GET with ID)
- ✅ UPDATE Student (PUT)
- ✅ DELETE Student (DELETE)
- ✅ Verify data persistence

### 3. Manual API Testing with curl

#### CREATE
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@test.com",
    "phone": "555-1234"
  }'
```

#### READ ALL
```bash
curl http://localhost:3000/api/students
```

#### READ ONE
```bash
curl "http://localhost:3000/api/students?id=1"
```

#### UPDATE
```bash
curl -X PUT "http://localhost:3000/api/students?id=1" \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'
```

#### DELETE
```bash
curl -X DELETE "http://localhost:3000/api/students?id=1"
```

---

## Production Testing (After Vercel Deployment)

### Replace `https://student-management.vercel.app` with your actual Vercel URL

### 1. Verify Server is Running
```bash
curl https://student-management.vercel.app
```

Should return the HTML home page.

### 2. Test CREATE API
```bash
curl -X POST https://student-management.vercel.app/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Production",
    "last_name": "Test",
    "email": "prod@test.com"
  }'
```

Expected: `201` status code with student object

### 3. Test READ API
```bash
curl https://student-management.vercel.app/api/students
```

Expected: `200` status code with array of students

### 4. Run Full Test Suite

#### Using Shell Script (Linux/Mac/WSL)
```bash
chmod +x test-production.sh
./test-production.sh https://student-management.vercel.app
```

#### Using PowerShell on Windows
Modified test-apis.ps1 to use production URL

---

## Expected Test Results

All endpoints should return appropriate HTTP status codes:

| Operation | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Create Student | POST | /api/students | 201 |
| Get All Students | GET | /api/students | 200 |
| Get Student | GET | /api/students?id=1 | 200 |
| Update Student | PUT | /api/students?id=1 | 200 |
| Delete Student | DELETE | /api/students?id=1 | 200 |
| Not Found | GET | /api/students?id=999 | 404 |
| Duplicate Email | POST | /api/students | 409 |

---

## Troubleshooting Production Deployment

### Issue: API returns 404

**Cause**: Endpoint not deployed correctly

**Solution**:
1. Check Vercel deployment logs
2. Verify `next.config.js` exists
3. Rebuild: `npm run build`
4. Redeploy

### Issue: Data not persisting

**Cause**: Vercel serverless functions are ephemeral

**Solution**: Integrate persistent database (see DEPLOYMENT_GUIDE.md)

### Issue: CORS Errors

**Cause**: Frontend and backend on different domains

**Solution**: Add CORS headers in `next.config.js`

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
      ],
    },
  ]
}
```

---

## Monitoring

Monitor your Vercel deployment:
1. Go to https://vercel.com/dashboard
2. Select your project
3. View real-time logs and metrics
4. Check function runtimes and costs
