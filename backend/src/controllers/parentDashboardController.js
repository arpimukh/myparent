const { pool } = require('../config/database')

const parentDashboardController = {
  // Get daughter dashboard data
  async getParentDashboard(req, res) {
    try {
      const { id } = req.params
      
      // Get daughter profile
      const [parentData] = await pool.execute(
        'SELECT * from (select p.*,d.name as daughter_name FROM parent_care_services. parents p  left outer join parent_care_services.daughters d on p.daughter_id=d.id ) t where t.user_id = ?',
        [id]
      )
      
      if (parentData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Parent not found'
        })
      }
      
      // Get parents associated with this daughter
      const [serviceData] = await pool.execute(
        `SELECT v.business_name as vendor_name, v.is_verified, v.service_description, c.* FROM parent_care_services.client_services c, parent_care_services.vendors v  WHERE v.user_id=c.client_id and client_id = ? and status !='completed' or status!= 'cancelled' order by created_at,booking_date desc`,[id]
      )

      const [events] = await pool.execute(
        'SELECT id,title, description, venue, event_date FROM events WHERE event_date > CURDATE() ORDER BY event_date ASC'
      )
      
      
      res.json({
        success: true,
        data: {
          parent: parentData,
          serviceList: serviceData,
          events: events
        }
      })
      
    } catch (error) {
      console.error('Get parent dashboard error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      })
    }
  },

  // Update service status
  async updateServiceStatus(req, res) {
    try {
      const { id } = req.params
      const { status } = req.body
      
      // This would update a services table when you implement service management
      res.json({
        success: true,
        message: 'Service status updated successfully'
      })
      
    } catch (error) {
      console.error('Update service status error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update service status'
      })
    }
  }
}

module.exports = parentDashboardController