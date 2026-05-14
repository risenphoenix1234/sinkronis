const clockify = require('../utils/clockifyClient');
const Employee = require('../models/employee');

const toggleClockInOut = async (req, res) => {
  try {
    const { userId } = req.user;
    const employee = await Employee.findById(userId).populate('companyId');

    if (!employee || !employee.clockifyUserId) {
      return res.status(404).json({ message: 'Clockify user not linked to employee' });
    }

    const { workspaceId } = employee.companyId;

    // Check for running time entry (i.e. already clocked in)
    const { data: inProgressEntries } = await clockify.get(
      `/workspaces/${workspaceId}/user/${employee.clockifyUserId}/time-entries?in-progress=true`
    );

    const runningEntry = inProgressEntries?.[0];

    if (runningEntry) {
      // 🔴 Clock Out
      const response = await clockify.put(
        `/workspaces/${workspaceId}/time-entries/${runningEntry.id}`,
        { end: new Date().toISOString() }
      );

      return res.status(200).json({
        message: 'Clocked out successfully',
        status: 'clocked_out',
        data: response.data
      });
    } else {
      // 🟢 Clock In
      const response = await clockify.post(
        `/workspaces/${workspaceId}/user/${employee.clockifyUserId}/time-entries`,
        {
          start: new Date().toISOString(),
          description: 'Clock in via HRIS'
        }
      );

      return res.status(200).json({
        message: 'Clocked in successfully',
        status: 'clocked_in',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Clock In/Out Error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Clock in/out failed' });
  }
};


module.exports = {
  toggleClockInOut
};