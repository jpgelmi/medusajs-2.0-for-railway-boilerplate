// src/middleware/static-files.ts
import express from 'express'
import path from 'path'

export default function staticMiddleware(req: any, res: any, next: any) {
  const staticPath = path.join(process.cwd(), 'static')
  return express.static(staticPath)(req, res, next)
}