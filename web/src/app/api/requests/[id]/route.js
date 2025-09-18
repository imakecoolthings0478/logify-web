import sql from '@/app/api/utils/sql';

// Delete request
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const [deletedRequest] = await sql`
      DELETE FROM requests 
      WHERE id = ${id}
      RETURNING *
    `;

    if (!deletedRequest) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }

    return Response.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Failed to delete request:', error);
    return Response.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}