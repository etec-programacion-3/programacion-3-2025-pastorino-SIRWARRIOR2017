const winston = require('winston');
const path = require('path');

// Definir niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato para desarrollo
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para producción
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Determinar el formato según el entorno
const format = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;

// Crear el logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels,
  format,
  transports: [
    // Escribir logs en consola
    new winston.transports.Console(),

    // Escribir todos los logs en combined.log
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      level: 'info',
    }),

    // Escribir solo errores en error.log
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
  ],
});

// Si no estamos en producción, también loguear en consola con formato bonito
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: devFormat,
  }));
}

module.exports = logger;
