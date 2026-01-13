/**
 * Local AI Provider
 * Executes ai-prompt.py to send prompts via browser extension
 */

import { spawn } from 'child_process';
import { getAppSettings, type AppSettings } from '@/lib/settings';

export interface LocalProviderOptions {
  timeout?: number;
  provider?: 'default' | 'chatgpt' | 'claude' | 'grok';
  scriptPath?: string;
}

export interface LocalProviderResponse {
  success: boolean;
  text: string;
  error?: string;
  session_id?: string;
  provider?: string;
}

/**
 * Execute the local AI script and return the response
 */
export async function executeLocalAI(
  prompt: string,
  options: LocalProviderOptions = {}
): Promise<LocalProviderResponse> {
  const settings = await getAppSettings();

  const scriptPath = options.scriptPath || settings?.local_api_path || '/home/wcooke/projects/ai-prompt/ai-prompt-cli/ai-prompt.py';
  const timeout = options.timeout || settings?.local_api_timeout || 120;
  const provider = options.provider || settings?.local_api_provider || undefined;

  // Get the directory containing the script to find the venv
  const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
  const venvActivate = `${scriptDir}/venv/bin/activate`;

  return new Promise((resolve, reject) => {
    const args: string[] = ['--json', '--response-timeout', timeout.toString()];

    // Only add provider flag if not 'default'
    if (provider && provider !== 'default') {
      args.push('--provider', provider);
    }

    // Escape the prompt for shell (handle quotes, newlines, special chars)
    const escapedPrompt = prompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$')
      .replace(/`/g, '\\`');

    // Build command that activates venv first
    const scriptArgs = args.map(a => `"${a}"`).join(' ');
    const command = `source "${venvActivate}" && python3 "${scriptPath}" ${scriptArgs} "${escapedPrompt}"`;

    // Log the exact command being executed (copy-paste ready)
    console.log('[Local AI] Executing command (copy-paste ready):');
    console.log('---');
    console.log(command);
    console.log('---');

    const process = spawn('bash', ['-c', command], {
      timeout: (timeout + 10) * 1000, // Add buffer to script timeout
      env: { ...global.process.env },
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        // Try to parse JSON error from stdout first
        try {
          const result = JSON.parse(stdout.trim());
          if (!result.success) {
            resolve(result);
            return;
          }
        } catch {
          // Not JSON, use stderr
        }

        reject(new Error(stderr || `Process exited with code ${code}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch {
        reject(new Error(`Invalid JSON response: ${stdout}`));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`Failed to execute local AI: ${err.message}`));
    });
  });
}

/**
 * Check if local AI is available
 */
export async function isLocalAIAvailable(): Promise<boolean> {
  try {
    const settings = await getAppSettings();
    if (!settings?.local_api_path) return false;

    // Check if script exists
    const { access } = await import('fs/promises');
    await access(settings.local_api_path);
    return true;
  } catch {
    return false;
  }
}
