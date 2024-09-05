import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const { audioFilePath, outputFilePath } = req.body;

  if (!audioFilePath || !outputFilePath) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const command = `rhubarb -f json -o ${outputFilePath} ${audioFilePath}`;

  exec(command, { cwd: path.resolve('./public') }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }
    res.status(200).json({ message: 'Lip sync data generated', data: stdout });
  });
}
