import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'messages.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { messages: [], typingUsers: [] };
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  const dirPath = path.dirname(DATA_FILE);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const data = readData();
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
    writeData(data);
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}