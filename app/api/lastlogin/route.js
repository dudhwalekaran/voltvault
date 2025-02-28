import AcceptedUser from '@/models/AcceptedUser'; // Correct import

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Update lastLogin for the given user
      const updatedUser = await AcceptedUser.findByIdAndUpdate(
        userId,
        { lastLogin: Date.now() }, // Set lastLogin to current date and time
        { new: true, select: 'lastLogin' } // Only return lastLogin field
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Respond with updated lastLogin
      return res.status(200).json({ 
        message: 'Last login updated successfully', 
        lastLogin: updatedUser.lastLogin 
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle invalid HTTP methods
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
