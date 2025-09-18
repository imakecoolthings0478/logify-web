import sql from '@/app/api/utils/sql';

// Get all requests
export async function GET(request) {
  try {
    const requests = await sql`
      SELECT * FROM requests 
      ORDER BY created_at DESC
    `;
    
    return Response.json({ requests });
  } catch (error) {
    console.error('Failed to fetch requests:', error);
    return Response.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// Create new request
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, discordUsername, serviceType, description, budget } = body;

    // Validation
    if (!email || !discordUsername || !serviceType || !description || !budget) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Discord username validation
    const discordRegex = /^[a-zA-Z0-9._-]{2,32}$/;
    if (!discordRegex.test(discordUsername)) {
      return Response.json({ error: 'Invalid Discord username' }, { status: 400 });
    }

    // Description length validation
    if (description.length > 500) {
      return Response.json({ error: 'Description must be 500 characters or less' }, { status: 400 });
    }

    const [newRequest] = await sql`
      INSERT INTO requests (email, discord_username, service_type, description, budget)
      VALUES (${email}, ${discordUsername}, ${serviceType}, ${description}, ${budget})
      RETURNING *
    `;

    return Response.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Failed to create request:', error);
    return Response.json({ error: 'Failed to create request' }, { status: 500 });
  }
}