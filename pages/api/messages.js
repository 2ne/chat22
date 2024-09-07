let data = { messages: [], typingUsers: [] };

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    if (req.body.type === 'message') {
      const newMessage = req.body.data;
      data.messages.push(newMessage);
    } else if (req.body.type === 'typing') {
      const { nickname, isTyping } = req.body.data;
      if (isTyping) {
        if (!data.typingUsers.includes(nickname)) {
          data.typingUsers.push(nickname);
        }
      } else {
        data.typingUsers = data.typingUsers.filter(user => user !== nickname);
      }
    } else {
      res.status(400).json({ error: 'Invalid request type' });
      return;
    }
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}