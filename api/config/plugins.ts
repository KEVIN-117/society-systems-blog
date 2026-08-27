import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '14d',
      },
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
        expiresIn: '14d',
        accessTokenLifespan: 1209600,       // 14 días (en lugar de 600)
        maxRefreshTokenLifespan: 2592000, // 30 días
        idleRefreshTokenLifespan: 1209600, // 14 días
        maxSessionLifespan: 86400,       // 1 día
        idleSessionLifespan: 7200,       // 2 horas
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;
