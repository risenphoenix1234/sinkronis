const axios = require('axios');

const BASE_URL = 'https://sinkronis-backend.vercel.app/api/v1';

async function audit() {
  const results = {};

  try {
    console.log('Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      organizationSlug: "kellogs",
      email: "sowolefemifestus@gmail.com",
      password: "Password@2026"
    });
    
    const token = loginRes.data.tokens?.accessToken || loginRes.data.data?.tokens?.accessToken;
    console.log('Login OK. User:', loginRes.data.user?.email || loginRes.data.data?.user?.email);
    results.auth = { status: 'OK', user: loginRes.data.user || loginRes.data.data?.user };

    const api = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    // Helper to test GET endpoint
    async function testGet(name, url, params = {}) {
      try {
        const res = await api.get(url, { params });
        results[name] = {
          status: 'SUCCESS',
          httpStatus: res.status,
          success: res.data.success,
          message: res.data.message,
          dataIsArray: Array.isArray(res.data.data),
          count: Array.isArray(res.data.data) ? res.data.data.length : (res.data.data ? 1 : 0),
          pagination: res.data.pagination,
          sample: Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
        };
        console.log(`[PASS] ${name}: ${res.status}`);
      } catch (err) {
        results[name] = {
          status: 'FAIL',
          httpStatus: err.response?.status,
          error: err.response?.data || err.message
        };
        console.log(`[FAIL] ${name}: ${err.response?.status} - ${JSON.stringify(err.response?.data || err.message)}`);
      }
    }

    console.log('\n--- Auditing Dashboard ---');
    await testGet('dashboard', '/hris/dashboard');

    console.log('\n--- Auditing Employees ---');
    await testGet('employees_list', '/hris/employees');

    console.log('\n--- Auditing Attendance ---');
    await testGet('attendance_my_today', '/hris/attendance/my-today');
    await testGet('attendance_overview', '/hris/attendance/overview');
    await testGet('attendance_daily', '/hris/attendance/daily');
    await testGet('attendance_department_summary', '/hris/attendance/department-summary');
    await testGet('attendance_logs', '/hris/attendance/logs');
    await testGet('attendance_disputes', '/hris/attendance/disputes');

    console.log('\n--- Auditing Leave Tracking ---');
    await testGet('leave_overview', '/hris/leave-requests/overview');
    await testGet('leave_requests', '/hris/leave-requests');

    console.log('\n--- Auditing Conduct ---');
    await testGet('conduct_queries', '/hris/conduct');
    await testGet('conduct_suspensions', '/hris/conduct/suspensions');

    console.log('\n--- Auditing Appraisals ---');
    await testGet('appraisals_overview', '/hris/appraisals/overview');
    await testGet('appraisals_active_cycle', '/hris/appraisals/cycles/active');
    await testGet('appraisals_cycles', '/hris/appraisals/cycles');
    await testGet('appraisals_reviews', '/hris/appraisals/reviews');
    await testGet('appraisals_settings', '/hris/appraisals/settings');
    await testGet('appraisals_templates', '/hris/appraisals/templates');

    // Test a specific employee profile if employees exist
    if (results.employees_list?.status === 'SUCCESS' && results.employees_list.count > 0) {
      const empId = results.employees_list.sample.id;
      console.log(`\n--- Auditing Employee Detail (${empId}) ---`);
      await testGet('employee_detail', `/hris/employees/${empId}`);
    }

    // Test a specific appraisal review detail if reviews exist
    if (results.appraisals_reviews?.status === 'SUCCESS' && results.appraisals_reviews.count > 0) {
      const appId = results.appraisals_reviews.sample.appraisalId;
      console.log(`\n--- Auditing Appraisal Detail (${appId}) ---`);
      await testGet('appraisal_detail', `/hris/appraisals/${appId}`);
    }

  } catch (err) {
    console.error('Audit fatal error:', err.response?.data || err.message);
  }

  const fs = require('fs');
  fs.writeFileSync('scripts/audit_results.json', JSON.stringify(results, null, 2));
  console.log('\nAudit results written to scripts/audit_results.json');
}

audit();
