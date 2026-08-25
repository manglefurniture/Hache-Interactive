# Perfil del proyecto — Hache Interactive

## Identidad

- Nombre: Hache Interactive
- Tipo de proyecto: sitio público / showroom / portafolio de servicios digitales
- Objetivo principal: presentar capacidades, proyectos demostrativos y productos reales; convertir visitas en conversaciones comerciales
- Usuarios esperados: prospectos, clientes y personas evaluando servicios digitales

## Organización

- Multiempresa: no
- Multisede: no
- Administradores globales: no aplica en el sitio público actual

## Datos y lógica

El repositorio actual es un sitio estático publicado con GitHub Pages. No contiene base de datos, autenticación, pagos, agenda ni panel administrativo.

## Integraciones

- WhatsApp: CTA comercial
- Instagram: perfil oficial
- Facebook: perfil oficial
- Hache Natación: proyecto/producto enlazado desde el portafolio
- APIs externas: no requeridas por el sitio actual

## SEO / superficie pública

- `SEO_MODE`: `public`
- Dominio canónico esperado: `https://hacheinteractive.com/`
- Ruta pública indexable principal: `/`
- Demos: navegables como portafolio, pero no indexables por tratarse de marcas y negocios ficticios
- SEO local: secundario; la entidad opera desde Cancún, México, sin páginas de ubicación en esta fase
- Search Console / Bing Webmaster Tools: pendiente de validación operativa fuera del repositorio
- Schema previsto: `Organization`
- Política de bots: rastreo permitido para la superficie pública; demos excluidos de indexación mediante `noindex,follow`

## Módulos Hache-Base seleccionados

- [x] SEO técnico / Minimum SEO Baseline
- [x] Pruebas estáticas
- [x] CI
- [x] Documentación y criterio de liberación
- [x] Endurecimiento básico del frontend
- [ ] Arquitectura backend por capas — no aplica al sitio estático actual
- [ ] Multisede / multiempresa — no aplica
- [ ] Roles / permisos — no aplica
- [ ] Seguridad web/API con sesión/CSRF/Bearer — no aplica mientras no exista backend
- [ ] Auditoría de mutaciones — no aplica
- [ ] Modelo de servicios recurrentes — no aplica
- [ ] Operaciones recurrentes — no aplica
- [ ] n8n — no forma parte del runtime del sitio
- [ ] Migraciones MariaDB — no aplica
- [ ] Backup/rollback de base de datos — no aplica
- [ ] Runner de despliegue VPS — no aplica a GitHub Pages

## Entornos

- Development: rama/entorno local
- Staging: rama de trabajo y preview/revisión antes de integrar a `main`
- Production: GitHub Pages desde `main` con dominio personalizado

## Criterio de listo para producción

- Todos los controles SEO `MUST` aplicables pasan o tienen excepción documentada.
- `robots.txt`, sitemap, canonical y metadata coherentes con el dominio productivo.
- Demos ficticios no se indexan.
- Navegación esencial funciona con teclado y controles accesibles.
- CI valida el HTML público antes de integrar.
- Los cambios se integran por commits trazables y reversibles.
