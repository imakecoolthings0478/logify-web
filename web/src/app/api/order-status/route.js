import sql from '@/app/api/utils/sql';

// Get order status
export async function GET(request) {
  try {
    const [setting] = await sql`
      SELECT setting_value FROM app_settings 
      WHERE setting_key = 'order_status'
    `;

    const orderStatus = setting ? setting.setting_value : true;
    return Response.json({ orderStatus });
  } catch (error) {
    console.error('Failed to fetch order status:', error);
    return Response.json({ error: 'Failed to fetch order status' }, { status: 500 });
  }
}

// Update order status
export async function POST(request) {
  try {
    const body = await request.json();
    const { orderStatus, password } = body;

    // Verify admin password
    if (password !== 'logify0478@makers') {
      return Response.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    if (typeof orderStatus !== 'boolean') {
      return Response.json({ error: 'Invalid order status value' }, { status: 400 });
    }

    const [updatedSetting] = await sql`
      UPDATE app_settings 
      SET setting_value = ${orderStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = 'order_status'
      RETURNING *
    `;

    return Response.json({ orderStatus: updatedSetting.setting_value });
  } catch (error) {
    console.error('Failed to update order status:', error);
    return Response.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}