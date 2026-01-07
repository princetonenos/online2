import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js'

const prisma = new PrismaClient()

// Resolve tenant (school) from host, path, header, or env
export const tenantResolver = async (req, _res, next) => {
  try {
    let slug = null
    let domain = null

    // 1) Subdomain (schoolSlug.domain.tld)
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().toLowerCase()
    if (host && host.includes('.')) {
      const parts = host.split(':')[0].split('.')
      if (parts.length > 2) {
        // subdomain exists
        slug = parts[0]
      }
      domain = host
    }

    // 2) Path based: /s/:schoolSlug/*
    if (!slug && req.url.startsWith('/api/')) {
      // Try to capture /api/v1/s/:slug prefix
      const segments = req.url.split('?')[0].split('/').filter(Boolean)
      // api v1 s slug ... => [api, v1, s, :slug]
      if (segments.length >= 4 && segments[2] === 's') {
        slug = segments[3]
      }
    }

    // 3) Dev/debug header
    if (!slug && req.headers['x-school']) {
      slug = req.headers['x-school'].toString().toLowerCase()
    }

    // 4) Fallback: env default
    if (!slug && process.env.DEFAULT_SCHOOL_SLUG) {
      slug = process.env.DEFAULT_SCHOOL_SLUG.toLowerCase()
    }

    let school = null
    if (slug) {
      school = await prisma.school.findFirst({ where: { OR: [{ name: slug }, { domain: slug }, { settings: { path: ['slug'], equals: slug } }] } })
      if (!school) {
        // Try by explicit column if you store slug in settings: { slug }
        school = await prisma.school.findFirst({ where: { settings: { path: ['slug'], equals: slug } } })
      }
    } else if (domain) {
      // Optional: map custom domain to schoolId if stored in School.domain
      school = await prisma.school.findFirst({ where: { domain } })
    }

    // Attach tenant (may be null for public endpoints)
    if (school) {
      req.tenant = { id: school.id, name: school.name, domain: school.domain, settings: school.settings || {} }
    }
    next()
  } catch (e) {
    logger.warn('tenantResolver error', e?.message || e)
    next()
  }
}

// Ensure authenticated user's school matches tenant (when both exist)
export const ensureTenantAccess = (req, _res, next) => {
  try {
    if (req.tenant && req.user && req.user.schoolId && req.user.schoolId !== req.tenant.id) {
      const err = new Error('Cross-tenant access forbidden')
      err.statusCode = 403
      throw err
    }
    next()
  } catch (e) {
    next(e)
  }
}
