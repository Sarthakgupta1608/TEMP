import { Request } from 'express';

export function getParam(req: Request, name: string): string {
  const param = req.params[name];
  if (Array.isArray(param)) {
    return param[0] || '';
  }
  return param || '';
}

