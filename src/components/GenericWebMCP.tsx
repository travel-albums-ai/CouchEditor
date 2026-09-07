import { useWebMCP } from 'usewebmcp';

export default function GenericWebMCP({ webMcp, deps }: { webMcp: { name: string; description: string; inputSchema?: any, execute: (input: any) => Promise<any> }, deps?: any[] }) {

  useWebMCP(webMcp, deps || []);

  return null;
}
