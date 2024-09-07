let messages = [];
let typingUsers = new Set();

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ messages, typingUsers: Array.from(typingUsers) });
  } else if (req.method === 'POST') {
    if (req.body.type === 'message') {
      const newMessage = req.body.data;
      messages.push(newMessage);
      res.status(201).json({ messages, typingUsers: Array.from(typingUsers) });
    } else if (req.body.type === 'typing') {
      const { nickname, isTyping } = req.body.data;
      if (isTyping) {
        typingUsers.add(nickname);
      } else {
        typingUsers.delete(nickname);
      }
      res.status(200).json({ messages, typingUsers: Array.from(typingUsers) });
    } else {
      res.status(400).json({ error: 'Invalid request type' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}