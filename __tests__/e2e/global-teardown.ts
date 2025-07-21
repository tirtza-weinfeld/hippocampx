import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function globalTeardown() {
  // Kill any remaining Next.js processes
  try {
    // On macOS/Linux
    await execAsync('pkill -f "next dev"');
    await execAsync('pkill -f "next-server"');
  } catch (error) {
    console.log('No Next.js processes to kill or error killing processes:', error);
  }
  
  // Also try to kill processes on port 3000 and 3001
  try {
    await execAsync('lsof -ti:3000 | xargs kill -9');
    await execAsync('lsof -ti:3001 | xargs kill -9');
  } catch (error) {
    console.log('No processes on ports 3000/3001 to kill or error killing processes:', error);
  }
}

export default globalTeardown; 